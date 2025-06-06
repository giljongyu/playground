import { ChangeEventHandler, useCallback, useState } from "react";

/**
 * @description
 * `useInputState` is a React hook that manages an input state with optional value transformation.
 *
 * @param {string} [initialValue=""] - The initial value of the input. Defaults to an empty string (`""`).
 * @param {(value: string) => string} [transformValue=(v: string) => v] - A function to transform the input value.
 *   Defaults to an identity function that returns the input unchanged.
 *
 * @returns {[value: string, onChange: (value: string) => void]} A tuple containing:
 * - value `string` - The current state value;
 * - onChange `(value: string) => void` - A function to update the state;
 *
 * @example
 * function Example() {
 *   const [value, setValue] = useInputState('');
 *   return <input type="text" value={value} onChange={setValue} />;
 * }
 */
export function useDraftInputState(
  initialValue = "",
  transformValue: (value: string) => string = echo
) {
  const [value, setValue] = useDraft(initialValue);

  const handleValueChange: ChangeEventHandler<HTMLElement & { value: string }> =
    useCallback(
      ({ target: { value } }) => {
        setValue(transformValue(value));
      },
      [transformValue, setValue]
    );

  return [value, handleValueChange] as const;
}

function echo(v: string) {
  return v;
}

const useDraft = <T>(initialState: T) => {
  const [draft, setDraft] = useState<T>();
  const value = draft ?? initialState;

  const onChangeValue = useCallback(
    (valueOrCallback: T | ((param: T) => T)) =>
      setDraft((prev) => {
        const prevValue = typeof prev === "undefined" ? initialState : prev;
        const newValue =
          typeof valueOrCallback === "function"
            ? (valueOrCallback as (param: T) => T)(prevValue)
            : valueOrCallback;
        return newValue;
      }),
    [initialState]
  );

  return [value, onChangeValue] as const;
};

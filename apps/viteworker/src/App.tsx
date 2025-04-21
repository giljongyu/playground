import { useState } from "react";
import { useInputState } from "./useInputState";
import { useDraftInputState } from "./useDraftInputState";
import { useStorageState } from "react-simplikit";

function App() {
  const [stroageValue, setStroageValue] = useStorageState<string>("hello");

  const [hello, setHello] = useState("defaultState");
  const [value, onChange] = useInputState(stroageValue);
  const [draft, setDraft] = useDraftInputState(stroageValue);
  return (
    <>
      <input
        type="text"
        value={stroageValue}
        onChange={(e) => setStroageValue(e.target.value)}
      />
      <input
        type="text"
        value={hello}
        onChange={(e) => {
          setHello(e.target.value);
        }}
      />

      <input type="text" value={value} onChange={onChange} />

      <input type="text" value={draft} onChange={setDraft} />
    </>
  );
}

export default App;

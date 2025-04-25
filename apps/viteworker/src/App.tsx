import { useState } from "react";
import { useInputState } from "./useInputState";
import { useDraftInputState } from "./useDraftInputState";
import { useStorageState } from "react-simplikit";
import * as Drawer from "vaul";
import { overlay } from "overlay-kit";
import { useStringContext } from "./Context";

function App() {
  const [stroageValue, setStroageValue] = useStorageState<string>("hello");

  const [hello, setHello] = useState("defaultState");
  const [value, onChange] = useInputState(stroageValue);
  const [draft, setDraft] = useDraftInputState(stroageValue);
  return (
    <>
      <button
        onClick={async () => {
          overlay.open(({ isOpen, close }) => (
            <Comp isOpen={isOpen} onClose={close} />
          ));
        }}
      >
        클릭하기
      </button>
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

const Comp = (props: { isOpen: boolean; onClose: () => void }) => {
  const { isOpen, onClose } = props;
  const value = useStringContext();

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Drawer.Title>컨텍스트값</Drawer.Drawer.Title>
          <Drawer.Drawer.Description>{value}</Drawer.Drawer.Description>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

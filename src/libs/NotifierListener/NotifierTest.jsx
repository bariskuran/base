import { baseStore } from "../@baseStore";
import { useRef } from "react";

export const NotifierTest = () => {
    const [_notifier] = baseStore.useGlobal((s) => [s._notifier]);
    const { add, remove, clear } = _notifier;
    const id = useRef(null);

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <button
                onClick={() => {
                    const idX = add("test");
                    id.current = idX;
                }}
            >
                Plain
            </button>
            <button
                onClick={() => {
                    const idX = add("test", { bgColor: "success" });
                    id.current = idX;
                }}
            >
                BgColor Success
            </button>
            <button
                onClick={() => {
                    const idX = add("test", { disableAutoKill: true });
                    id.current = idX;
                }}
            >
                Disable Auto Kill
            </button>
            <button onClick={() => clear()}>Clear</button>
            <button onClick={() => remove(id.current)}>Remove</button>
        </div>
    );
};

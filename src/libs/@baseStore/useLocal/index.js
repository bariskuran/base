import { useMemo } from "react";
import { create } from "../create";
import { use } from "../use";

/*

const { x, y, setLocal, setLocalByPath } = useLocal({ x: 0, y: 0 });
setLocal((s) => { s.x = 1; });
setLocalByPath("y", 2);

*/

export const useLocal = (initialState = {}) => {
    const store = useMemo(() => create(initialState), []);
    return {
        ...use(store),
        setLocal: store.set,
        setLocalByPath: (path, value) => {
            store.set((s) => {
                s[path] = value;
            });
        },
        localStore: store,
    };
};

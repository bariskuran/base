import { useMemo } from "react";
import { create } from "../create";
import { use } from "../use";

/*

const { x, y, store } = useLocalCoreStore({ x: 0, y: 0 });

*/

export const useLocal = (initialState = {}) => {
    const store = useMemo(() => create(initialState), []);
    return { ...use(store), setLocal: store.set };
};

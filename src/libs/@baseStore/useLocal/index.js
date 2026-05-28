import { useMemo } from "react";
import { create } from "../create";
import { use } from "../use";

export const useLocal = (initialState = {}) => {
    const store = useMemo(() => create(initialState), []);
    return {
        ...use(store),
        localStore: store,
    };
};

import { useMemo } from "react";
import { baseStore } from "../../baseStore";

export const useDefineStore = (props) => {
    const { store } = props || {};
    const isExternal = !!store;


    const { set: setFromLocal, localStore: storeLocal, ...stateLocal } = baseStore.useLocal();


    const safeExternalStore = store || storeLocal;
    const { set: setFromUse, ...stateUse } = baseStore.use(safeExternalStore);


    return useMemo(() => {
        const state = isExternal ? stateUse : stateLocal;
        const set = isExternal ? setFromUse : setFromLocal;
        const activeStore = isExternal ? store : storeLocal;

        return {
            ...(state || {}),
            set,
            store: activeStore,
        };
    }, [isExternal, stateUse, stateLocal, setFromUse, setFromLocal, store, storeLocal]);
};

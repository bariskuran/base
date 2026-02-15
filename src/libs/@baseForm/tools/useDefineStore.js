import { useMemo } from "react";
import { baseStore } from "../../@baseStore";

export const useDefineStore = (props) => {
    const { store } = props || {};
    const isExternal = !!store;

    /* Local Store */
    const { setLocal, localStore: storeLocal, ...stateLocal } = baseStore.useLocal();

    /* Injected Store (always call, but always pass a valid store) */
    const safeExternalStore = store || storeLocal;
    const { set: setUse, ...stateUse } = baseStore.use(safeExternalStore);

    /* Define and Return */
    return useMemo(() => {
        const state = isExternal ? stateUse : stateLocal;
        const set = isExternal ? setUse : setLocal;
        const activeStore = isExternal ? store : storeLocal;

        return {
            ...(state || {}),
            set,
            store: activeStore,
        };
    }, [isExternal, stateUse, stateLocal, setUse, setLocal, store, storeLocal]);
};

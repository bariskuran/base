import { useRef, useSyncExternalStore, useMemo } from "react";

/*

const [x, a] = useCoreStore(baseStore, (s) => [s.x, s.a]);
const state = useCoreStore(baseStore);

*/

const shallowEqual = (a, b) => {
    if (Object.is(a, b)) return true;
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!Object.is(a[i], b[i])) return false;
        }
        return true;
    }
    if (Array.isArray(a) || Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (!Object.is(a[key], b[key])) return false;
    }
    return true;
};

/**
 * @typedef {Object} UseCoreStoreSettings
 * @property {Object} store - Core store instance
 * @property {Function} selector - Selector function
 * @property {Function} equalityFn - Equality function
 */
export const use = (store, selector, equalityFn) => {
    if (!store || typeof store.subscribe !== "function" || typeof store.get !== "function") {
        throw new Error("Unknown baseStore.");
    }

    const cacheRef = useRef({
        has: false,
        value: undefined,
        stateVersion: undefined,
    });

    const getStoreVersion = store.getVersion || (() => undefined);

    const getSnapshot = useMemo(() => {
        return () => {
            const state = store.get();
            const currentVersion = getStoreVersion();

            if (typeof selector !== "function") {
                if (
                    cacheRef.current.has &&
                    Object.is(cacheRef.current.stateVersion, currentVersion)
                ) {
                    return cacheRef.current.value;
                }
                cacheRef.current.has = true;
                cacheRef.current.value = state;
                cacheRef.current.stateVersion = currentVersion;
                return state;
            }

            const selected = selector(state);
            const isEqual = equalityFn
                ? equalityFn
                : (a, b) => {
                      if (!a || typeof a !== "object" || !b || typeof b !== "object") {
                          return Object.is(a, b);
                      }
                      return shallowEqual(a, b);
                  };

            if (cacheRef.current.has) {
                if (isEqual(cacheRef.current.value, selected)) {
                    return cacheRef.current.value;
                }
            }

            cacheRef.current.has = true;
            cacheRef.current.value = selected;
            cacheRef.current.stateVersion = currentVersion;
            return selected;
        };
    }, [store, selector, equalityFn, getStoreVersion]);

    return useSyncExternalStore(
        (onStoreChange) => store.subscribe(onStoreChange),
        getSnapshot,
        getSnapshot,
    );
};

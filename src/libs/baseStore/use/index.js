import { useRef, useSyncExternalStore, useMemo } from "react";
import { isShallowEqual } from "../../isShallowEqual";

export const use = (store, selector, equalityFn) => {
    if (!store || typeof store.subscribe !== "function" || typeof store.get !== "function") {
        throw new Error("Unknown baseStore.");
    }

    const cacheRef = useRef({
        has: false,
        base: undefined,
        value: undefined,
        stateVersion: undefined,
    });

    const getStoreVersion = store.getVersion || (() => undefined);

    const getStoreAPI = () => ({
        get: store.get,
        set: store.set,
        setByPath: store.setByPath,
        remove: store.remove,
    });

    const withStoreAPI = (value) => {
        const api = getStoreAPI();

        if (Array.isArray(value)) return value;

        if (value && typeof value === "object") {
            return { ...value, ...api };
        }

        return value;
    };

    const getSnapshot = useMemo(() => {
        return () => {
            const state = store.get();
            const stateWithAPI = withStoreAPI(state);
            const currentVersion = getStoreVersion();

            const isEqual =
                equalityFn ||
                ((a, b) => {
                    if (!a || typeof a !== "object" || !b || typeof b !== "object") {
                        return Object.is(a, b);
                    }
                    return isShallowEqual(a, b);
                });

            if (typeof selector !== "function") {
                if (
                    cacheRef.current.has &&
                    Object.is(cacheRef.current.stateVersion, currentVersion)
                ) {
                    return cacheRef.current.value;
                }

                const value = stateWithAPI;

                cacheRef.current.has = true;
                cacheRef.current.base = stateWithAPI;
                cacheRef.current.value = value;
                cacheRef.current.stateVersion = currentVersion;

                return value;
            }

            const baseSelected = selector(stateWithAPI);

            if (cacheRef.current.has) {
                if (isEqual(cacheRef.current.base, baseSelected)) {
                    return cacheRef.current.value;
                }
            }

            const value = baseSelected;

            cacheRef.current.has = true;
            cacheRef.current.base = baseSelected;
            cacheRef.current.value = value;
            cacheRef.current.stateVersion = currentVersion;

            return value;
        };
    }, [store, selector, equalityFn, getStoreVersion]);

    return useSyncExternalStore(
        (onStoreChange) => store.subscribe(onStoreChange),
        getSnapshot,
        getSnapshot,
    );
};

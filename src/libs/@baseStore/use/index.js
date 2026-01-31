import { useRef, useSyncExternalStore, useMemo } from "react";
import { shallowEqual } from "../../shallowEqual";

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

    const attachSet = (selected) => {
        const set = store.set;

        if (Array.isArray(selected)) return [...selected, set];

        if (selected && typeof selected === "object") {
            if ("set" in selected) return selected;
            return { ...selected, set };
        }

        return [selected, set];
    };

    const getSnapshot = useMemo(() => {
        return () => {
            const state = store.get();
            const currentVersion = getStoreVersion();

            const isEqual =
                equalityFn ||
                ((a, b) => {
                    if (!a || typeof a !== "object" || !b || typeof b !== "object") {
                        return Object.is(a, b);
                    }
                    return shallowEqual(a, b);
                });

            if (typeof selector !== "function") {
                if (
                    cacheRef.current.has &&
                    Object.is(cacheRef.current.stateVersion, currentVersion)
                ) {
                    return cacheRef.current.value;
                }

                const base = state;
                const value = attachSet(base);

                cacheRef.current.has = true;
                cacheRef.current.base = base;
                cacheRef.current.value = value;
                cacheRef.current.stateVersion = currentVersion;

                return value;
            }

            const baseSelected = selector(state);

            if (cacheRef.current.has) {
                if (isEqual(cacheRef.current.base, baseSelected)) {
                    return cacheRef.current.value;
                }
            }

            const value = attachSet(baseSelected);

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

import { useEffect, useRef } from "react";
import { isDeepEqual } from "../isDeepEqual";
import { findDifferences as findDifferencesFn } from "../findDifferences";
import { baseStore } from "../@baseStore";

export const useBaseEffect = (fn, deps = [], settings = {}) => {
    const isDevMode = baseStore.useGlobal((s) => s.isDevMode);

    const {
        skipEffect = false,
        useEffectAfterMount = false,
        return: returnFn,
        useFalsyDeps = false,
        executeOnDev = false,
        findDifferences = false,
    } = settings || {};

    const prevRef = useRef([]);
    const firstRef = useRef(true);

    const hasChanged = () => {
        if (skipEffect) return false;

        if (firstRef.current) {
            firstRef.current = false;
            prevRef.current = Array.isArray(deps) ? deps.slice() : [];
            return !useEffectAfterMount;
        }

        if (useFalsyDeps) return true;

        const prev = prevRef.current;
        const next = Array.isArray(deps) ? deps : [];

        if (prev.length !== next.length) {
            prevRef.current = next.slice();
            return true;
        }

        for (let i = 0; i < next.length; i++) {
            if (!isDeepEqual(prev[i], next[i])) {
                prevRef.current = next.slice();
                return true;
            }
        }

        return false;
    };

    useEffect(
        () => {
            if (executeOnDev && !isDevMode) return;

            const changed = hasChanged();
            if (!changed) return;

            if (findDifferences) {
                const differences = findDifferencesFn(prevRef.current, deps);
                fn({ differences });
            } else {
                fn();
            }

            if (typeof returnFn === "function") return returnFn;
        },
        useFalsyDeps ? undefined : deps,
    );
};

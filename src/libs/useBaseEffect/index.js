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
    const diffPrevRef = useRef([]);
    const firstRef = useRef(true);
    const fnRef = useRef(fn);
    const returnFnRef = useRef(returnFn);
    fnRef.current = fn;
    returnFnRef.current = returnFn;

    const hasChanged = () => {
        if (skipEffect) return false;

        if (firstRef.current) {
            firstRef.current = false;
            diffPrevRef.current = [];
            prevRef.current = Array.isArray(deps) ? deps.slice() : [];
            return !useEffectAfterMount;
        }

        if (useFalsyDeps) return true;

        const prev = prevRef.current;
        const next = Array.isArray(deps) ? deps : [];

        if (prev.length !== next.length) {
            diffPrevRef.current = prev.slice();
            prevRef.current = next.slice();
            return true;
        }

        for (let i = 0; i < next.length; i++) {
            if (!isDeepEqual(prev[i], next[i])) {
                diffPrevRef.current = prev.slice();
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
                const prevDeps = diffPrevRef.current;
                const nextDeps = deps;
                const prevArr = Array.isArray(prevDeps) ? prevDeps : [];
                const nextArr = Array.isArray(nextDeps) ? nextDeps : [];

                // Single dep: compare the value, not the deps array (paths: "name" not "0.name")
                const oldData =
                    prevArr.length === 1 && nextArr.length === 1 ? prevArr[0] : prevDeps;
                const newData =
                    prevArr.length === 1 && nextArr.length === 1 ? nextArr[0] : nextDeps;

                const differences = findDifferencesFn(oldData, newData);
                fnRef.current?.({ differences });
            } else {
                fnRef.current?.();
            }

            if (typeof returnFnRef.current === "function") return returnFnRef.current();
        },
        useFalsyDeps ? undefined : deps,
    );
};

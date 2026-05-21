import { useRef, useCallback } from "react";

/**
 * Returns a function with a stable reference that always invokes the latest `fn`.
 */
export const useStableCallback = (fn) => {
    const fnRef = useRef(fn);
    fnRef.current = fn;
    return useCallback((...args) => fnRef.current?.(...args), []);
};

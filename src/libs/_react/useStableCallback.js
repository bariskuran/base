import { useRef, useCallback } from "react";

export const useStableCallback = (fn) => {
    const fnRef = useRef(fn);
    fnRef.current = fn;
    return useCallback((...args) => fnRef.current?.(...args), []);
};

import { useMemo, useRef } from "react";
import { debouncedFunction } from "../debouncedFunction";
import { useStableCallback } from "../_react/useStableCallback";

export const useDebouncedFunction = (fn, settings = {}) => {
    const stableFn = useStableCallback(fn);

    const {
        delay = 500,
        isThrottle = false,
        getFirst = false,
        functionName,
        onStart,
        onEnd,
    } = settings;

    const onStartRef = useRef(onStart);
    const onEndRef = useRef(onEnd);
    onStartRef.current = onStart;
    onEndRef.current = onEnd;

    const hasOnStart = Boolean(onStart);
    const hasOnEnd = Boolean(onEnd);

    const stableSettings = useMemo(
        () => ({
            delay,
            isThrottle,
            getFirst,
            functionName,
            onStart: hasOnStart ? (...args) => onStartRef.current?.(...args) : undefined,
            onEnd: hasOnEnd ? () => onEndRef.current?.() : undefined,
        }),
        [delay, isThrottle, getFirst, functionName, hasOnStart, hasOnEnd],
    );

    return useMemo(
        () => debouncedFunction(stableFn, stableSettings),
        [stableFn, stableSettings],
    );
};

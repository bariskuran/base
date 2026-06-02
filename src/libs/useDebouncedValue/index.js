import { useEffect, useMemo, useRef } from "react";
import { baseStore } from "../baseStore";

export const useDebouncedValue = (initialValue, settings = {}) => {
    const { delay = 500, isThrottle = false, enabled = true } = settings;

    const initialRef = useRef(initialValue);
    const initialState = useMemo(
        () => ({
            value: initialValue,
            debouncedValue: initialValue,
            isWaiting: false,
        }),
        [],
    );

    const { value, debouncedValue, isWaiting, set } = baseStore.useLocal(initialState);

    const timerRef = useRef(null);
    const valueRef = useRef(value);
    const prevValueRef = useRef(value);
    const throttleActiveRef = useRef(false);
    const setLocalRef = useRef(set);

    setLocalRef.current = set;
    valueRef.current = value;

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const endThrottleCooldown = () => {
        throttleActiveRef.current = false;
        timerRef.current = null;
        setLocalRef.current?.({
            debouncedValue: valueRef.current,
            isWaiting: false,
        });
    };

    useEffect(() => () => clearTimer(), []);

    useEffect(() => {
        if (!enabled) {
            clearTimer();
            throttleActiveRef.current = false;
            set?.({ debouncedValue: value, isWaiting: false });
            return;
        }

        if (!isThrottle) {
            clearTimer();
            throttleActiveRef.current = false;
            timerRef.current = setTimeout(() => {
                set?.({ debouncedValue: value });
            }, delay);
            return;
        }

        if (prevValueRef.current === value) return;
        prevValueRef.current = value;

        if (throttleActiveRef.current) return;

        throttleActiveRef.current = true;
        set?.({ debouncedValue: value, isWaiting: true });
        timerRef.current = setTimeout(endThrottleCooldown, delay);
    }, [value, delay, isThrottle, enabled, set]);

    const setValue = (next) => set?.({ value: next });
    const setDebouncedValue = (next) => set?.({ debouncedValue: next });
    const reset = (next) => {
        const v = next !== undefined ? next : initialRef.current;
        clearTimer();
        throttleActiveRef.current = false;
        valueRef.current = v;
        prevValueRef.current = v;
        set?.({ value: v, debouncedValue: v, isWaiting: false });
    };

    return [debouncedValue, setValue, { value, setDebouncedValue, reset, isWaiting }];
};

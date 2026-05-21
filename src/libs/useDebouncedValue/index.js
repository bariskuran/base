import { useEffect, useMemo, useRef } from "react";
import { baseStore } from "../@baseStore";

/*

const [debouncedVal1, setDebouncedVal1] = useDebouncedValue(val1, { delay: 2000 });

*/

/**
 * Stores a value and provides a debounced/throttled version of it.
 *
 * - Debounce (default): updates `debouncedValue` after no changes happen for `delay` ms.
 * - Throttle: updates `debouncedValue` at most once per `delay` ms (leading edge + trailing flush).
 *
 * @typedef {Object} UseDebouncedValueSettings
 * @property {number} [delay=500] - Delay in milliseconds
 * @property {boolean} [isThrottle=false] - If true, uses throttle instead of debounce
 * @property {boolean} [enabled=true] - If false, disables timing behavior (debouncedValue follows value immediately)
 *
 * @template T
 * @param {T} initialValue - Initial value
 * @param {UseDebouncedValueSettings} [settings={}] - Hook settings
 *
 * @returns {[
 *   T,                                  // debouncedValue
 *   (next: T) => void,                  // setValue
 *   T,                                  // value (raw)
 *   (next: T) => void,                  // setDebouncedValue (manual)
 *   (next?: T) => void,                 // reset (to initial or provided)
 *   boolean                             // isWaiting (throttle cooldown)
 * ]}
 */
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

    const { value, debouncedValue, isWaiting, setLocal } = baseStore.useLocal(initialState);

    const timerRef = useRef(null);
    const valueRef = useRef(value);
    const prevValueRef = useRef(value);
    const throttleActiveRef = useRef(false);
    const setLocalRef = useRef(setLocal);

    setLocalRef.current = setLocal;
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
            setLocal?.({ debouncedValue: value, isWaiting: false });
            return;
        }

        if (!isThrottle) {
            clearTimer();
            throttleActiveRef.current = false;
            timerRef.current = setTimeout(() => {
                setLocal?.({ debouncedValue: value });
            }, delay);
            return;
        }

        if (prevValueRef.current === value) return;
        prevValueRef.current = value;

        if (throttleActiveRef.current) return;

        throttleActiveRef.current = true;
        setLocal?.({ debouncedValue: value, isWaiting: true });
        timerRef.current = setTimeout(endThrottleCooldown, delay);
    }, [value, delay, isThrottle, enabled, setLocal]);

    const setValue = (next) => setLocal?.({ value: next });
    const setDebouncedValue = (next) => setLocal?.({ debouncedValue: next });
    const reset = (next) => {
        const v = next !== undefined ? next : initialRef.current;
        clearTimer();
        throttleActiveRef.current = false;
        valueRef.current = v;
        prevValueRef.current = v;
        setLocal?.({ value: v, debouncedValue: v, isWaiting: false });
    };

    return [debouncedValue, setValue, { value, setDebouncedValue, reset, isWaiting }];
};

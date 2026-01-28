import { useEffect, useMemo, useRef } from "react";
import { baseStore } from "../@baseStore";

/*

const [debouncedVal1, setDebouncedVal1] = useDebouncedValue(val1, { delay: 2000 });

*/

/**
 * Stores a value and provides a debounced/throttled version of it.
 *
 * - Debounce (default): updates `debouncedValue` after no changes happen for `delay` ms.
 * - Throttle: updates `debouncedValue` at most once per `delay` ms.
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

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        if (!enabled) {
            clearTimer();
            setLocal?.({ debouncedValue: value, isWaiting: false });
            return;
        }

        clearTimer();

        if (!isThrottle) {
            timerRef.current = setTimeout(() => {
                setLocal?.({ debouncedValue: value });
            }, delay);

            return clearTimer;
        }

        if (isWaiting) return;

        setLocal?.({ debouncedValue: value, isWaiting: true });

        timerRef.current = setTimeout(() => {
            setLocal?.({ isWaiting: false });
        }, delay);

        return clearTimer;
    }, [value, delay, isThrottle, enabled, isWaiting, setLocal]);

    const setValue = (next) => setLocal?.({ value: next });
    const setDebouncedValue = (next) => setLocal?.({ debouncedValue: next });
    const reset = (next) => {
        const v = next !== undefined ? next : initialRef.current;
        setLocal?.({ value: v, debouncedValue: v, isWaiting: false });
    };

    return [debouncedValue, setValue, { value, setDebouncedValue, reset, isWaiting }];
};

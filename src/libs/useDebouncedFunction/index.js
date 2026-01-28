import { useMemo } from "react";
import { debouncedFunction } from "../debouncedFunction";

/**
 * @typedef {Object} DebounceSettings
 * @property {number} [delay] - Delay (ms)
 * @property {boolean} [isThrottle] - Throttle mode
 * @property {boolean} [getFirst] - Run the first call immediately
 * @property {string} [functionName] - Function name
 */

/**
 * @param {Function} fn - Debounced function
 * @param {Partial<DebounceSettings>} [settings={}] - Settings object
 * @returns {Function} Debounced function
 */
export const useDebouncedFunction = (fn, settings = {}) =>
    useMemo(() => debouncedFunction(fn, settings), [fn, settings]);

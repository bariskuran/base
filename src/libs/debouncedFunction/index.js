import { generateRandom } from "../generateRandom";

/**
 
   const debounced = debouncedFunction(fn, {
    delay = 500,
    isThrottle = false,
    getFirst = false,
    getPrevious = false,
    functionName = generateRandom.text(16),
   });
   debounced();
 
 */
const ref = {};
let cleanupIntervalId = null;
const autoFunctionNameRef = new WeakMap();

const getAutoFunctionName = (fn) => {
    if (typeof fn !== "function") return generateRandom.text(16);
    const current = autoFunctionNameRef.get(fn);
    if (current) return current;
    const next = generateRandom.text(16);
    autoFunctionNameRef.set(fn, next);
    return next;
};

const cleanupUnusedEntries = () => {
    const now = Date.now();
    for (const key in ref) {
        if (!ref[key]?.lastUsed || now - ref[key].lastUsed > 60_000) {
            if (ref[key]?.timeout) clearTimeout(ref[key].timeout);
            delete ref[key];
        }
    }
};

if (typeof window !== "undefined" && !cleanupIntervalId) {
    cleanupIntervalId = setInterval(cleanupUnusedEntries, 300_000);
}

/**
 * @typedef {Object} DebounceSettings
 * @property {number} [delay] - Delay (ms)
 * @property {boolean} [isThrottle] - Throttle mode
 * @property {boolean} [getFirst] - Run the first call immediately (debounce mode only)
 * @property {string} [functionName] - Shared state key (auto-generated per fn when omitted)
 */

/**
 * @param {Function} fn - Debounced function
 * @param {Partial<DebounceSettings>} [settings={}] - Settings object
 * @returns {Function} Debounced function
 */
export const debouncedFunction = (
    fn,
    {
        delay = 500,
        isThrottle = false,
        getFirst = false,
        functionName,
        onStart,
        onEnd,
    } = {},
) => {
    if (!delay || delay < 100) return fn;
    const scopedFunctionName = functionName || getAutoFunctionName(fn);
    const shouldRunFirst = !isThrottle && getFirst;

    const entry =
        ref[scopedFunctionName] ||
        (ref[scopedFunctionName] = {
            timeout: null,
            lastUsed: 0,
            lastArgs: null,
            calledDuringWait: false,
            isWaiting: false,
        });

    if (!isThrottle) {
        return (...args) => {
            entry.lastUsed = Date.now();

            const isFirstCallInWindow = entry.timeout == null;

            if (isFirstCallInWindow) {
                onStart?.(...args);
            }

            if (shouldRunFirst && isFirstCallInWindow) {
                fn(...args);
                entry.calledDuringWait = false;
            } else if (entry.timeout != null) {
                entry.calledDuringWait = true;
            }

            entry.lastArgs = args;

            if (entry.timeout) clearTimeout(entry.timeout);

            entry.timeout = setTimeout(() => {
                if (!shouldRunFirst || entry.calledDuringWait) {
                    fn(...entry.lastArgs);
                }

                entry.timeout = null;
                entry.lastArgs = null;
                entry.calledDuringWait = false;

                onEnd?.();
            }, delay);
        };
    }

    return (...args) => {
        entry.lastUsed = Date.now();
        entry.lastArgs = args;

        if (!entry.isWaiting) {
            entry.isWaiting = true;

            onStart?.(...args);

            entry.calledDuringWait = true;

            entry.timeout = setTimeout(() => {
                entry.isWaiting = false;

                if (entry.calledDuringWait) {
                    fn(...entry.lastArgs);
                }

                if (entry.timeout) clearTimeout(entry.timeout);
                entry.timeout = null;
                entry.lastArgs = null;
                entry.calledDuringWait = false;

                onEnd?.();
            }, delay);

            return;
        }

        entry.calledDuringWait = true;
    };
};

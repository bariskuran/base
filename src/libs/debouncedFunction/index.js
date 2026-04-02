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
 * @property {boolean} [getFirst] - Run the first call immediately
 * @property {string} [functionName] - Function name
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
        functionName = generateRandom.text(16),
        onStart,
        onEnd,
    } = {},
) => {
    if (!delay || delay < 100) return fn;

    const entry =
        ref[functionName] ||
        (ref[functionName] = {
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

            if (getFirst && isFirstCallInWindow) {
                fn(...args);
                entry.calledDuringWait = false;
            } else if (entry.timeout != null) {
                entry.calledDuringWait = true;
            }

            entry.lastArgs = args;

            if (entry.timeout) clearTimeout(entry.timeout);

            entry.timeout = setTimeout(() => {
                if (!getFirst || entry.calledDuringWait) {
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

            if (getFirst) {
                fn(...args);
                entry.calledDuringWait = false;
            } else {
                entry.calledDuringWait = true;
            }

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

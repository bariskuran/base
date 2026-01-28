import { baseStore } from "../@baseStore";

/*

logReferrers("recalc called");

 */

/**
 * Development-only debug utility that logs provided arguments together
 * with the current JavaScript call stack.
 *
 * Logging is automatically disabled when `isDevMode` is false
 * in the global core store.
 *
 * Useful for tracing where a function or code path was triggered from.
 *
 * @param {...any} args
 * Values to log before the stack trace
 *
 * @returns {void}
 */
export const logReferrers = (...args) => {
    const { isDevMode } = baseStore.globalData.get();
    if (!isDevMode) return;
    console.log(...args, new Error().stack);
};

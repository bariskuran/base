/**
 * Pauses execution for a given amount of time.
 *
 * Useful for testing, demos, async flow control, or simulating delayed operations.
 *
 * @param {number} ms - Time to wait in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 *
 * @example
 * await sleep(500);
 * console.log("500ms later");
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

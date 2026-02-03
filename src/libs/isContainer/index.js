import { isPlainObject } from "../isPlainObject";

/**
 * Checks if a value is a container (array or plain object).
 *
 * @param {*} v
 * @returns {boolean}
 */
export const isContainer = (v) => Array.isArray(v) || isPlainObject(v);

import { isArray } from "../isArray";
import { isPlainObject } from "../isPlainObject";

/**
 * @param {*} v
 * @returns {boolean} true if `v` is an array or a plain object (not `Date`, class instances, etc.).
 */
export const isArrayOrPlainObject = (v) => isArray(v) || isPlainObject(v);

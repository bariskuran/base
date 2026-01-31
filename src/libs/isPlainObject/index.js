import { typeOf } from "../typeOf";

/**
 * Checks if a value is a plain object.
 *
 * @param {*} v
 * @returns {boolean}
 *
 * @example
 * isPlainObject({ a: 1 }); // true
 *
 * @example
 * isPlainObject(new Date()); // false
 *
 * @example
 * isPlainObject(new Map()); // false
 *
 * @example
 * isPlainObject(new Set()); // false
 *
 * @example
 * isPlainObject(new Function()); // false
 *
 * @example
 * isPlainObject(new Error()); // false
 */

export const isPlainObject = (v) => {
    if (typeOf(v) !== "object") return false;
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
};

export const isContainer = (v) => Array.isArray(v) || isPlainObject(v);

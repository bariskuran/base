import { typeOf } from "../typeOf";
import { isPlainObject } from "../isPlainObject";

/**
 * Checks shallow equality between two values with strict rules:
 *
 * - Primitives: only `Object.is(a, b)` is considered equal.
 * - Arrays: equal only if both are arrays, have the same length, and each index is `Object.is`.
 * - Plain objects: equal only if both are plain objects (prototype is `Object.prototype` or `null`),
 *   have the same own-key set (by length + key presence), and each value is `Object.is`.
 * - Everything else (Date, Map, Set, Function, class instances, etc.) is never shallow-equal
 *   unless `Object.is(a, b)` was already true.
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 *
 * @example
 * shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 *
 * @example
 * shallowEqual([1, 2], [1, 2]); // true
 *
 * @example
 * shallowEqual({ a: 1 }, { a: 1, b: 2 }); // false
 *
 * @example
 * shallowEqual(new Date(0), new Date(0)); // false
 */

export const shallowEqual = (a, b) => {
    if (Object.is(a, b)) return true;

    const ta = typeOf(a);
    const tb = typeOf(b);

    if (ta !== tb) return false;

    if (ta === "array") {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!Object.is(a[i], b[i])) return false;
        }
        return true;
    }

    if (ta === "object") {
        if (!isPlainObject(a) || !isPlainObject(b)) return false;

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!Object.is(a[key], b[key])) return false;
        }
        return true;
    }

    return false;
};

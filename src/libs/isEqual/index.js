import { typeOf } from "../typeOf";
import { useEffect } from "react";
import { baseStore } from "../@baseStore";

const DEFAULTS = {
    treatFalsiesAsEqual: false,
    maxKeys: 500,
    maxDepth: 10,
    useHashShortcut: true,
};

/**
 * Deep equality check for objects/arrays with basic cycle protection and limits.
 *
 * Rules:
 * - Uses `Object.is` for primitives (so `NaN` equals `NaN`).
 * - Compares functions by `toString()` (best-effort).
 * - Compares arrays by length + ordered items.
 * - Compares plain objects by own enumerable keys + deep values.
 * - Optional: treats all falsy values as equal when `treatFalsiesAsEqual` is true.
 * - Optional: if both objects have a `.hash` and they match, returns true early.
 *
 * Limits:
 * - `maxDepth`: recursion depth limit (default 10)
 * - `maxKeys`: max key/item count to compare (default 500)
 *
 * @param {*} a
 * @param {*} b
 * @param {Object} [settings]
 * @param {boolean} [settings.treatFalsiesAsEqual=false]
 * @param {number} [settings.maxKeys=500]
 * @param {number} [settings.maxDepth=10]
 * @param {boolean} [settings.useHashShortcut=true]
 * @returns {boolean}
 *
 * @example
 * isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
 *
 * @example
 * isEqual([1, 2, 3], [1, 2, 3]); // true
 * isEqual([1, 2, 3], [1, 3, 2]); // false
 *
 * @example
 * isEqual(NaN, NaN); // true (Object.is)
 *
 * @example
 * isEqual(null, undefined); // false
 * isEqual(null, undefined, { treatFalsiesAsEqual: true }); // true
 *
 * @example
 * const a = {}; a.self = a;
 * const b = {}; b.self = b;
 * isEqual(a, b); // true (cycle-safe for isomorphic cycles)
 */
export const isEqual = (a, b, settings = {}, level = 0, seen) => {
    const opts = { ...DEFAULTS, ...(settings || {}) };

    if (level > opts.maxDepth) return false;

    if (Object.is(a, b)) return true;

    if (opts.treatFalsiesAsEqual) {
        if (!a && !b) return true;
    }

    const t1 = typeOf(a);
    const t2 = typeOf(b);
    if (t1 !== t2) return false;

    if (t1 === "date") return a.getTime() === b.getTime();

    if (t1 === "regexp") return a.source === b.source && a.flags === b.flags;

    if (t1 === "function") return a.toString() === b.toString();

    if (t1 !== "object" && t1 !== "array") return false;

    if (a && b && opts.useHashShortcut && a.hash && b.hash && a.hash === b.hash) return true;

    if (a && b && typeof a === "object" && typeof b === "object") {
        if (!seen) seen = new WeakMap();

        const cached = seen.get(a);
        if (cached && cached === b) return true;
        seen.set(a, b);
    }

    if (a instanceof Date) return b instanceof Date && a.getTime() === b.getTime();

    if (a instanceof RegExp)
        return b instanceof RegExp && a.source === b.source && a.flags === b.flags;

    if (t1 === "array") {
        if (a.length !== b.length) return false;
        if (a.length > opts.maxKeys) return false;
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i], opts, level + 1, seen)) return false;
        }
        return true;
    }

    const keysA = Object.keys(a || {});
    const keysB = Object.keys(b || {});
    if (keysA.length !== keysB.length) return false;

    if (keysA.length > opts.maxKeys) return false;

    for (const k of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
        if (!isEqual(a[k], b[k], opts, level + 1, seen)) return false;
    }

    return true;
};

export const useIsEqual = (value) => {
    const { data, setLocal } = baseStore.useLocal({ data: value });

    useEffect(() => {
        setLocal((s) => {
            if (isEqual(s.data, value)) return;
            s.data = value;
        });
    }, [value, setLocal]);

    return data;
};

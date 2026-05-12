import { typeOf } from "../typeOf";
import { byPath } from "../byPath";

const DEFAULTS = {
    treatFalsiesAsEqual: false,
    maxKeys: 500,
    maxDepth: 10,
    ignoreArrayOrder: false,
};

/** Multiset-style array equality: same length, each left item pairs with exactly one unused right item (deep `isDeepEqual`). */
const arraysEqualIgnoreOrder = (a, b, opts, level, seen) => {
    const used = new Uint8Array(b.length);
    outer: for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (used[j]) continue;
            if (isDeepEqual(a[i], b[j], opts, level + 1, seen)) {
                used[j] = 1;
                continue outer;
            }
        }
        return false;
    }
    return true;
};

/**
 * Deep equality check for objects/arrays with basic cycle protection and limits.
 *
 * Rules:
 * - Uses `Object.is` for primitives (so `NaN` equals `NaN`).
 * - Compares functions by `toString()` (best-effort).
 * - Compares arrays by length + ordered items (or multiset-style when `ignoreArrayOrder` is true).
 * - Compares plain objects by own enumerable keys + deep values.
 * - Optional: treats all falsy values as equal when `treatFalsiesAsEqual` is true.
 * - Optional: `comparePath` (dot path, see `byPath`) — only compares values at that path in both roots; other keys are ignored. No special treatment for a property named `hash`; use e.g. `comparePath: "wrap.hash"` if you intend to compare that field.
 * - Optional: `ignoreArrayOrder` compares arrays as multisets (same length, each item paired exactly once by deep equality, order ignored).
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
 * @param {string} [settings.comparePath] When set (non-empty), only `byPath.get(a, comparePath)` vs `byPath.get(b, comparePath)` are compared deeply; the rest of each root is ignored.
 * @param {boolean} [settings.ignoreArrayOrder=false] When true, array equality ignores element order (multiset / content-based pairing).
 * @returns {boolean}
 *
 * @example
 * isDeepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
 *
 * @example
 * isDeepEqual([1, 2, 3], [1, 2, 3]); // true
 * isDeepEqual([1, 2, 3], [1, 3, 2]); // false
 *
 * @example
 * isDeepEqual(NaN, NaN); // true (Object.is)
 *
 * @example
 * isDeepEqual(null, undefined); // false
 * isDeepEqual(null, undefined, { treatFalsiesAsEqual: true }); // true
 *
 * @example
 * isDeepEqual([1, 2], [2, 1], { ignoreArrayOrder: true }); // true
 * isDeepEqual([1, 1, 2], [1, 2, 1], { ignoreArrayOrder: true }); // true
 *
 * @example
 * isDeepEqual({ a: 1, b: { c: 2 } }, { a: 2, b: { c: 2 } }); // false
 * isDeepEqual({ a: 1, b: { c: 2 } }, { a: 2, b: { c: 2 } }, { comparePath: "b.c" }); // true
 * isDeepEqual({ wrap: { id: 1, n: 1 } }, { wrap: { id: 1, n: 9 } }, { comparePath: "wrap" }); // false (subtree differs)
 * isDeepEqual({ wrap: { id: 1, tag: "x" } }, { wrap: { id: 1, tag: "x" } }, { comparePath: "wrap.tag" }); // true
 *
 * @example
 * const a = {}; a.self = a;
 * const b = {}; b.self = b;
 * isDeepEqual(a, b); // true (cycle-safe for isomorphic cycles)
 */
export const isDeepEqual = (a, b, settings = {}, level = 0, seen) => {
    const opts = { ...DEFAULTS, ...(settings || {}) };

    if (level > opts.maxDepth) return false;

    if (
        level === 0 &&
        typeof opts.comparePath === "string" &&
        opts.comparePath.trim() !== ""
    ) {
        const p = opts.comparePath.trim();
        const va = byPath.get(a, p);
        const vb = byPath.get(b, p);
        const { comparePath: _comparePath, ...rest } = opts;
        return isDeepEqual(va, vb, rest, level, seen);
    }

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
        if (opts.ignoreArrayOrder) return arraysEqualIgnoreOrder(a, b, opts, level, seen);
        for (let i = 0; i < a.length; i++) {
            if (!isDeepEqual(a[i], b[i], opts, level + 1, seen)) return false;
        }
        return true;
    }

    const keysA = Object.keys(a || {});
    const keysB = Object.keys(b || {});
    if (keysA.length !== keysB.length) return false;

    if (keysA.length > opts.maxKeys) return false;

    for (const k of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
        if (!isDeepEqual(a[k], b[k], opts, level + 1, seen)) return false;
    }

    return true;
};

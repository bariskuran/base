import { typeOf } from "../typeOf";
import { byPath } from "../byPath";

const DEFAULTS = {
    treatFalsiesAsEqual: false,
    maxKeys: 500,
    maxDepth: 10,
    ignoreArrayOrder: false,
};

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

export const isDeepEqual = (a, b, settings = {}, level = 0, seen) => {
    const opts = { ...DEFAULTS, ...(settings || {}) };

    if (level > opts.maxDepth) return false;

    if (level === 0 && typeof opts.comparePath === "string" && opts.comparePath.trim() !== "") {
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

import { typeOf } from "../typeOf";
import { isDeepEqual } from "../isDeepEqual";
import { isArrayOrPlainObject } from "../isArrayOrPlainObject";

export const findDifferences = (oldData, newData, settings = {}) => {
    const { isDeepEqualSettings } = settings || {};

    if (isDeepEqual(oldData, newData, isDeepEqualSettings)) {
        return { changedPaths: [], differences: {} };
    }

    const t1 = typeOf(oldData);
    const t2 = typeOf(newData);

    const isLeafType = (t) => t !== "object" && t !== "array";

    if (
        t1 !== t2 ||
        isLeafType(t1) ||
        isLeafType(t2) ||
        !isArrayOrPlainObject(oldData) ||
        !isArrayOrPlainObject(newData)
    ) {
        return [["$"], { oldValue: oldData, newValue: newData }];
    }

    const tree = diffTree(oldData, newData, isDeepEqualSettings);
    const paths = findPaths(tree);
    return { changedPaths: paths, differences: tree };
};

const isDiffLeaf = (v) => v && typeof v === "object" && ("oldValue" in v || "newValue" in v);

const diffTree = (a, b, isDeepEqualSettings, level = 0, maxDepth = 50) => {
    if (level > maxDepth) return { oldValue: a, newValue: b };
    if (isDeepEqual(a, b, isDeepEqualSettings)) return {};

    const ta = typeOf(a);
    const tb = typeOf(b);

    if (ta !== tb || !(ta === "object" || ta === "array") || !isArrayOrPlainObject(a) || !isArrayOrPlainObject(b)) {
        return { oldValue: a, newValue: b };
    }

    if (ta === "array") {
        const len = Math.max(a.length || 0, b.length || 0);
        const changedByIndex = new Map();
        let maxChangedIndex = -1;

        for (let i = 0; i < len; i++) {
            const sub = diffTree(a[i], b[i], isDeepEqualSettings, level + 1, maxDepth);
            if (isDiffLeaf(sub) || (sub && typeof sub === "object" && Object.keys(sub).length)) {
                changedByIndex.set(i, sub);
                if (i > maxChangedIndex) maxChangedIndex = i;
            }
        }

        if (maxChangedIndex === -1) return {};


        const out = Array.from({ length: maxChangedIndex + 1 }, () => ({}));
        for (const [idx, value] of changedByIndex.entries()) {
            out[idx] = value;
        }

        return out;
    }

    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    const out = {};
    for (const k of keys) {
        const sub = diffTree(a?.[k], b?.[k], isDeepEqualSettings, level + 1, maxDepth);
        if (isDiffLeaf(sub) || (sub && typeof sub === "object" && Object.keys(sub).length)) {
            out[k] = sub;
        }
    }

    return out;
};

export const findPaths = (tree, basePath = "") => {
    const out = [];

    if (!tree || typeof tree !== "object") return out;

    if (isDiffLeaf(tree)) {
        out.push(basePath || "$");
        return out;
    }

    if (Array.isArray(tree)) {
        for (let i = 0; i < tree.length; i++) {
            const value = tree[i];
            if (!value || typeof value !== "object") continue;

            const nextPath = basePath ? `${basePath}.${i}` : String(i);

            if (isDiffLeaf(value)) {
                out.push(nextPath);
            } else {
                out.push(...findPaths(value, nextPath));
            }
        }
        return out;
    }

    for (const [key, value] of Object.entries(tree)) {
        if (!value || typeof value !== "object") continue;

        const nextPath = basePath ? `${basePath}.${key}` : key;

        if (isDiffLeaf(value)) {
            out.push(nextPath);
        } else {
            out.push(...findPaths(value, nextPath));
        }
    }

    return out;
};

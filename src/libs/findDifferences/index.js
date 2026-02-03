import { typeOf } from "../typeOf";
import { isEqual } from "../isEqual";
import { isContainer } from "../isContainer";

/**
 * Builds a diff tree and a flat list of changed paths between two values.
 *
 * Diff tree shape:
 * - Leaf nodes: { oldValue: X, newValue: Y }
 * - Nested nodes: objects/arrays containing deeper leaf nodes.
 *
 * Paths:
 * - For nested diffs: "a.b.0.c" style paths
 * - If the root itself is a leaf diff: paths = ["$"]
 *
 * @param {*} oldData
 * @param {*} newData
 * @param {Object} [settings]
 * @param {Object} [settings.isEqualSettings] - Settings passed into `isEqual`.
 * @returns {Object} {changedPaths: string[], differences: any}
 *
 * @example
 * // Primitive change (root leaf)
 * const {changedPaths, differences} = findDifferences(1, 2);
 * // paths => ["$"]
 * // tree  => { oldValue: 1, newValue: 2 }
 *
 * @example
 * // Object nested change
 * const a = { user: { name: "Baris", age: 30 }, ok: true };
 * const b = { user: { name: "Barış", age: 30 }, ok: true };
 * const {changedPaths, differences} = findDifferences(a, b);
 * // paths => ["user.name"]
 * // tree  => { user: { name: { oldValue: "Baris", newValue: "Barış" } } }
 *
 * @example
 * // Array change (index paths)
 * const a = { items: [{ title: "A" }, { title: "B" }] };
 * const b = { items: [{ title: "A" }, { title: "C" }] };
 * const {changedPaths, differences} = findDifferences(a, b);
 * // paths => ["items.1.title"]
 * // tree  => { items: [ , { title: { oldValue: "B", newValue: "C" } } ] }
 */
export const findDifferences = (oldData, newData, settings = {}) => {
    const { isEqualSettings } = settings || {};

    if (isEqual(oldData, newData, isEqualSettings)) {
        return [[], {}];
    }

    const t1 = typeOf(oldData);
    const t2 = typeOf(newData);

    const isLeafType = (t) => t !== "object" && t !== "array";

    if (
        t1 !== t2 ||
        isLeafType(t1) ||
        isLeafType(t2) ||
        !isContainer(oldData) ||
        !isContainer(newData)
    ) {
        return [["$"], { oldValue: oldData, newValue: newData }];
    }

    const tree = diffTree(oldData, newData, isEqualSettings);
    const paths = findPaths(tree);
    return { changedPaths: paths, differences: tree };
};

const isDiffLeaf = (v) => v && typeof v === "object" && ("oldValue" in v || "newValue" in v);

const diffTree = (a, b, isEqualSettings, level = 0, maxDepth = 50) => {
    if (level > maxDepth) return { oldValue: a, newValue: b };
    if (isEqual(a, b, isEqualSettings)) return {};

    const ta = typeOf(a);
    const tb = typeOf(b);

    if (ta !== tb || !(ta === "object" || ta === "array") || !isContainer(a) || !isContainer(b)) {
        return { oldValue: a, newValue: b };
    }

    if (ta === "array") {
        const len = Math.max(a.length || 0, b.length || 0);
        const out = [];
        let hasAny = false;

        for (let i = 0; i < len; i++) {
            const sub = diffTree(a[i], b[i], isEqualSettings, level + 1, maxDepth);
            if (isDiffLeaf(sub) || (sub && typeof sub === "object" && Object.keys(sub).length)) {
                out[i] = sub;
                hasAny = true;
            }
        }

        return hasAny ? out : {};
    }

    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    const out = {};
    for (const k of keys) {
        const sub = diffTree(a?.[k], b?.[k], isEqualSettings, level + 1, maxDepth);
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

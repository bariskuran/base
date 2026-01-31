import { typeOf } from "../typeOf";

const isMergeableObject = (value) => value !== null && typeOf(value) === "object";
const isUnsafeKey = (key) => key === "__proto__" || key === "constructor" || key === "prototype";

/**
 * Deeply merges two objects.
 *
 * Merge rules:
 * - If `newData` is NOT a mergeable object, it completely overrides `oldData`
 * - If `oldData` is NOT mergeable, `newData` is shallow-cloned and returned
 * - Only plain objects are merged recursively
 * - Arrays and primitives are replaced, not merged
 *
 * @param {*} oldData - Existing value
 * @param {*} newData - Incoming value
 * @returns {*} Merged result
 *
 * @example
 * deepMerge(
 *   { a: 1, b: { x: 10, y: 20 } },
 *   { b: { y: 99 }, c: 3 }
 * )
 * // → { a: 1, b: { x: 10, y: 99 }, c: 3 }
 *
 * @example
 * deepMerge(
 *   { a: 1 },
 *   "override"
 * )
 * // → "override"
 *
 * @example
 * deepMerge(
 *   null,
 *   { theme: "dark" }
 * )
 * // → { theme: "dark" }
 *
 * @example
 * deepMerge(
 *   { list: [1, 2, 3] },
 *   { list: [4] }
 * )
 * // → { list: [4] } (arrays are replaced)
 */
export const deepMerge = (oldData, newData) => {
    if (!isMergeableObject(newData)) {
        return newData;
    }
    if (!isMergeableObject(oldData)) {
        return { ...newData };
    }

    const output = { ...oldData };

    for (const key of Object.keys(newData)) {
        if (isUnsafeKey(key)) continue;

        const nextVal = newData[key];
        const prevVal = oldData[key];

        if (isMergeableObject(nextVal) && isMergeableObject(prevVal)) {
            output[key] = deepMerge(prevVal, nextVal);
        } else {
            output[key] = nextVal;
        }
    }

    return output;
};

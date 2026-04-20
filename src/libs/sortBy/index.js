/**
 * Collection of comparison functions for "smart" ascending and descending sorting.
 *
 * Features:
 * - If both values are numeric (or numeric strings), sorts numerically.
 * - If values start with a numeric prefix (e.g. "10px", "2px"),
 *   compares the numeric prefix first.
 * - Falls back to locale-aware string comparison.
 *
 * Designed to be used directly with `Array.prototype.sort`.
 *

 */

/**
 * Natural, case-insensitive sort helpers.
 *
 * - Splits strings into text and number segments.
 * - Compares number segments numerically.
 * - Compares text segments case-insensitively.
 * - Falls back to localeCompare when needed.
 *
 * Designed to be used directly with Array.prototype.sort.
 *  * @example
 * [1, 10, 2].sort(sortFunction.asc);
 * // → [1, 2, 10]
 *
 * @example
 * ["10", "2", "1"].sort(sortFunction.asc);
 * // → ["1", "2", "10"]
 *
 * @example
 * ["10px", "2px", "1px"].sort(sortFunction.asc);
 * // → ["1px", "2px", "10px"]
 *
 * @example
 * ["b", "a", "c"].sort(sortFunction.desc);
 * // → ["c", "b", "a"]
 */
export const sortBy = {
    asc: (a, b) => naturalCompare(a, b),
    desc: (a, b) => naturalCompare(b, a),
};

const naturalCompare = (a, b) => {
    if (a === b) return 0;
    const sa = String(a);
    const sb = String(b);
    const rx = /(\d+|\D+)/g;
    const partsA = sa.match(rx) || [];
    const partsB = sb.match(rx) || [];
    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
        const pa = partsA[i];
        const pb = partsB[i];
        if (pa === undefined) return -1;
        if (pb === undefined) return 1;
        const na = Number(pa);
        const nb = Number(pb);
        const isNumA = !Number.isNaN(na);
        const isNumB = !Number.isNaN(nb);
        if (isNumA && isNumB) {
            if (na !== nb) return na - nb;
            continue;
        }
        if (!isNumA && !isNumB) {
            const cmp = pa.localeCompare(pb, undefined, { sensitivity: "base" });
            if (cmp !== 0) return cmp;
            continue;
        }
        return isNumA ? -1 : 1;
    }

    return 0;
};

import { sortBy } from "../sortBy";

const ASC_ALIASES = new Set(["asc", "ascending", "a-z", "z-a", "A-Z"]);

const DESC_ALIASES = new Set(["desc", "descending", "Z-A"]);

export const resolvePushAsSortedSortFn = (direction = "asc") => {
    const raw = String(direction ?? "asc").trim();
    const lower = raw.toLowerCase();

    if (DESC_ALIASES.has(raw) || lower === "desc" || lower === "descending") {
        return sortBy.desc;
    }

    if (ASC_ALIASES.has(raw) || lower === "asc" || lower === "ascending") {
        return sortBy.asc;
    }

    return sortBy.asc;
};

export const pushAsSorted = (arr = [], el = 0, settings = {}) => {
    const { unique = false, removeDuplicates = false, direction = "asc" } = settings;

    const sortFn = resolvePushAsSortedSortFn(direction);
    const shouldPush = !unique || !arr.includes(el);

    let working = [...arr];
    if (shouldPush) working.push(el);

    const sorted = working.sort(sortFn);
    const result = removeDuplicates ? [...new Set(sorted)] : sorted;

    const pushedIndex = result.indexOf(el);
    const lastIndex = result.length - 1;

    const lowerValue = lastIndex >= 0 ? result[0] : undefined;
    const higherValue = lastIndex >= 0 ? result[lastIndex] : undefined;

    return {
        result,
        pushedIndex,
        lowerValue,
        higherValue,
    };
};

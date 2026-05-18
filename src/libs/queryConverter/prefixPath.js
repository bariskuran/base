/** Dot-separated query key prefix → bracket segments (e.g. "filters.form" → ["filters", "form"]). */
export const splitPrefixPath = (prefix) => {
    if (prefix == null || typeof prefix !== "string") return [];
    return prefix.trim().split(".").filter(Boolean);
};

/** First segment bare, rest bracketed: ["filters","form","page"] → filters[form][page]. */
export const buildBracketKeyPath = (segments) => {
    if (!segments?.length) return "";
    const [first, ...rest] = segments;
    return first + rest.map((seg) => `[${seg}]`).join("");
};

/** Prefix path + one object key → full query key path. */
export const buildQueryKeyWithPrefix = (prefix, key) => {
    const parts = splitPrefixPath(prefix);
    return buildBracketKeyPath(parts.length ? [...parts, String(key)] : [String(key)]);
};

/** Parsed root → object at prefix path (plain object only). */
export const unwrapByPrefix = (root, prefix) => {
    const parts = splitPrefixPath(prefix);
    if (!parts.length) return root;

    let cur = root;
    for (const segment of parts) {
        if (cur == null || typeof cur !== "object" || Array.isArray(cur)) return {};
        cur = cur[segment];
    }

    if (cur != null && typeof cur === "object" && !Array.isArray(cur)) return cur;
    return {};
};

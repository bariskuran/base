/** JSON.stringify drops undefined keys and serializes NaN as null — use for DS output panels. */
export const jsonDisplayReplacer = (_key, v) => {
    if (v === undefined) return "undefined";
    if (typeof v === "number" && Number.isNaN(v)) return "NaN";
    return v;
};

export const formatJsonForDisplay = (value) => {
    if (typeof value === "string") return value;
    return JSON.stringify(value, jsonDisplayReplacer, 2);
};

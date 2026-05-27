/** JSON.stringify drops undefined keys and serializes NaN as null — use for DS output panels. */
export const jsonDisplayReplacer = (_key, v) => {
    if (v === undefined) return "undefined";
    if (typeof v === "number" && Number.isNaN(v)) return "NaN";
    if (typeof v === "function") return `[Function${v.name ? ` ${v.name}` : ""}]`;
    return v;
};

const safeStringify = (value, space = 2) => {
    const seen = new WeakSet();

    return JSON.stringify(
        value,
        (key, v) => {
            if (typeof v === "function") {
                return `[Function${v.name ? ` ${v.name}` : ""}]`;
            }

            if (typeof v === "object" && v !== null) {
                if (seen.has(v)) return "[Circular]";
                seen.add(v);
            }

            return jsonDisplayReplacer(key, v);
        },
        space,
    );
};

export const formatJsonForDisplay = (value) => {
    if (typeof value === "string") return value;
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "function") return value.toString();

    try {
        const json = safeStringify(value);
        return typeof json === "string" ? json : String(value);
    } catch {
        return String(value);
    }
};

/** Typo.code / output panels only — never stringify React elements. */
export const coerceToCodeText = (value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "function") return value.toString();

    return formatJsonForDisplay(value);
};

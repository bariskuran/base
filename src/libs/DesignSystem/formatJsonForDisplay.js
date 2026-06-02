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

const TINT_SHADE_SCALE_COMMENT = "/* tint1...100 && shade1...100 */";

const isTintShadeScaleObject = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const keys = Object.keys(value);
    if (keys.length === 0) return false;

    const isScaleKey = (key) => /^tint\d+$/.test(key) || /^shade\d+$/.test(key);
    if (!keys.some(isScaleKey)) return false;

    return keys.every(isScaleKey);
};

const formatDisplayValue = (value, indent = 0, seen = new WeakSet()) => {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "function") return `[Function${value.name ? ` ${value.name}` : ""}]`;
    if (typeof value === "string") return JSON.stringify(value);

    if (typeof value === "object") {
        if (seen.has(value)) return '"[Circular]"';
        seen.add(value);
    }

    if (isTintShadeScaleObject(value)) {
        return `{ ${TINT_SHADE_SCALE_COMMENT} }`;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        const pad = " ".repeat(indent);
        const inner = " ".repeat(indent + 2);
        const lines = value.map((item) => `${inner}${formatDisplayValue(item, indent + 2, seen)}`);
        return `[\n${lines.join(",\n")}\n${pad}]`;
    }

    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";

    const pad = " ".repeat(indent);
    const inner = " ".repeat(indent + 2);
    const lines = keys.map((key) => {
        const keyStr = JSON.stringify(key);
        const formatted = formatDisplayValue(value[key], indent + 2, seen);
        return `${inner}${keyStr}: ${formatted}`;
    });

    return `{\n${lines.join(",\n")}\n${pad}}`;
};

export const formatGlobalDataForDisplay = (value) => {
    try {
        return formatDisplayValue(value, 0);
    } catch {
        return formatJsonForDisplay(value);
    }
};

export const coerceToCodeText = (value) => {
    if (value == null || value === "") return null;
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "function") return value.toString();

    return formatJsonForDisplay(value);
};

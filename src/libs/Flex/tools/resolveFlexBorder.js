import { colorGet } from "../../colorGet";
import { cssNormalizeSize } from "../../cssNormalizeSize";

const BORDER_STYLES = new Set([
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
]);

const isBorderWidthToken = (token) => {
    if (token == null || token === "") return false;
    const t = String(token).trim();
    if (/^(thin|medium|thick)$/i.test(t)) return true;
    return /^-?\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|ch|ex)?$/i.test(t);
};

const resolveBorderColorPart = (colorPart) => {
    if (colorPart == null || String(colorPart).trim() === "") return undefined;
    const raw = String(colorPart).trim();
    const fromTheme = colorGet(raw);
    return fromTheme?.color ?? raw;
};

const splitCssTokens = (value) => {
    if (typeof value !== "string") return [value];

    const parts = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < value.length; i++) {
        if (value.slice(i, i + 5).toLowerCase() === "calc(") {
            current += value.slice(i, i + 5);
            depth += 1;
            i += 4;
            continue;
        }

        const char = value[i];

        if (char === ")" && depth > 0) {
            depth -= 1;
            current += char;
            continue;
        }

        if (/\s/.test(char) && depth === 0) {
            if (current) {
                parts.push(current.trim());
                current = "";
            }
            continue;
        }

        current += char;
    }

    if (current) parts.push(current.trim());
    return parts.filter(Boolean);
};

export const resolveBorderCSSValue = (value) => {
    if (value == null || value === "") return undefined;

    if (typeof value === "number") {
        const width = cssNormalizeSize(value);
        return `${width} solid currentColor`;
    }

    const raw = String(value).trim();
    if (!raw) return undefined;

    const parts = splitCssTokens(raw);
    if (parts.length === 0) return undefined;

    if (parts.length === 1) {
        const only = parts[0];
        if (BORDER_STYLES.has(only.toLowerCase())) {
            return `1px ${only} currentColor`;
        }
        if (isBorderWidthToken(only)) {
            return `${cssNormalizeSize(only)} solid currentColor`;
        }
        const color = resolveBorderColorPart(only);
        return color ? `1px solid ${color}` : raw;
    }

    let width = "1px";
    let style = "solid";
    let colorStartIndex = 0;

    if (isBorderWidthToken(parts[0])) {
        width = cssNormalizeSize(parts[0]);
        colorStartIndex = 1;
        if (parts[1] && BORDER_STYLES.has(parts[1].toLowerCase())) {
            style = parts[1].toLowerCase();
            colorStartIndex = 2;
        }
    } else if (BORDER_STYLES.has(parts[0].toLowerCase())) {
        style = parts[0].toLowerCase();
        colorStartIndex = 1;
    }

    const colorPart = parts.slice(colorStartIndex).join(" ").trim();
    if (!colorPart) {
        return `${width} ${style} currentColor`;
    }

    const color = resolveBorderColorPart(colorPart);
    return `${width} ${style} ${color}`;
};

const BORDER_SIDE_KEYS = [
    "border",
    "borderTop",
    "borderRight",
    "borderBottom",
    "borderLeft",
    "borderInline",
    "borderBlock",
    "borderInlineStart",
    "borderInlineEnd",
    "borderBlockStart",
    "borderBlockEnd",
];

export const generateFlexBorders = (props = {}) => {
    const out = {};

    for (const key of BORDER_SIDE_KEYS) {
        const value = props[key];
        if (value == null || value === "") continue;
        const resolved = resolveBorderCSSValue(value);
        if (resolved != null) out[key] = resolved;
    }

    return out;
};

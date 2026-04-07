export const normalizeCssSize = (value) => {
    if (value == null) return value;

    if (typeof value === "number") {
        return `${value}rem`;
    }

    if (typeof value === "string") {
        let v = value.trim();

        v = v.replace(/\s+/g, "");

        if (/^\d+(\.\d+)?$/.test(v)) {
            return `${v}rem`;
        }

        if (/^\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|dvw|dvh)$/.test(v)) {
            return v;
        }

        return v;
    }

    return value;
};

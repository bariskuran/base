export const cssNormalizeSize = (value) => {
    if (value == null) return undefined;

    if (value === 0 || value === "0") return 0;

    if (typeof value === "number") {
        return `${value}rem`;
    }

    if (typeof value === "string") {
        let v = value.trim();
        v = v.replace(/\s+/g, "");

        if (/^0+(\.0+)?$/.test(v)) {
            return 0;
        }

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

export const normalizeCalcValue = (value) =>
    typeof value === "string"
        ? value.replace(
              /calc\((.*)\)/g,
              (_, expression) => `calc(${expression.replace(/\s*([+\-*/])\s*/g, " $1 ")})`,
          )
        : value;

export const getCssSize = (value) => {
    if (value == null) return "0";
    if (value === 0 || value === "0") return "0";
    if (typeof value === "number") return `${value}rem`;

    const v = String(value).trim().replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(v)) return `${v}rem`;

    return normalizeCalcValue(v);
};

export const getLayoutSizeCss = (value) => {
    if (value == null || value === "") return undefined;

    if (typeof value === "string") {
        const v = value.trim();

        if (/^-?\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|dvw|dvh)$/i.test(v)) {
            return normalizeCalcValue(v);
        }

        if (/^(calc|min|max)\(/i.test(v)) {
            return normalizeCalcValue(v);
        }
    }

    return getCssSize(value);
};

export const remToPx = (remValue) => {
    const rem = Number(remValue);
    if (!Number.isFinite(rem)) return 0;
    if (typeof document === "undefined") return rem * 16;

    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rem * (Number.isFinite(rootPx) && rootPx > 0 ? rootPx : 16);
};

export const parseCssLengthToPx = (value, baseFontSize = 16) => {
    if (value == null || value === "") return 0;

    const raw = String(value).trim();

    if (raw === "0") return 0;
    if (/^-?\d+(\.\d+)?px$/i.test(raw)) return parseFloat(raw);
    if (/^-?\d+(\.\d+)?rem$/i.test(raw)) return remToPx(parseFloat(raw));
    if (/^-?\d+(\.\d+)?em$/i.test(raw)) return parseFloat(raw) * baseFontSize;
    if (/^-?\d+(\.\d+)?$/.test(raw)) return remToPx(parseFloat(raw));

    return 0;
};

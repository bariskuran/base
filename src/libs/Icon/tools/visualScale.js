export const resolveSize = (a, b, c) => a ?? b ?? c;

export const resolveNumber = (value, fallback = null) => {
    if (value == null) return fallback;
    const n = Number(value);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

export const resolveVisualScale = ({
    explicitScale,
    widthAlias,
    widthAliasShort,
    widthAliasSize,
    baseSize,
    fallback = 1,
}) => {
    const scaleValue = resolveNumber(explicitScale, null);
    if (scaleValue != null) return scaleValue;

    const targetWidth = resolveNumber(
        resolveSize(widthAliasSize, widthAliasShort, widthAlias),
        null,
    );

    if (targetWidth != null && baseSize > 0) {
        return targetWidth / baseSize;
    }

    return fallback;
};

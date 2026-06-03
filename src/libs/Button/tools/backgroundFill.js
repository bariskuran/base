export const isNonTransparentBgProp = (value) => {
    if (value == null) return false;
    const s = String(value).trim().toLowerCase();
    if (s === "" || s === "transparent") return false;
    return true;
};

export const bgAppearsFilled = (bg) => {
    if (bg == null) return false;
    const s = String(bg).trim().toLowerCase();
    if (s === "" || s === "transparent") return false;
    if (/^#[0-9a-f]{8}$/i.test(s) && s.slice(-2) === "00") return false;
    return true;
};

export const anyBgColorPropNonTransparent = (colors = {}) =>
    isNonTransparentBgProp(colors.bgColor) ||
    isNonTransparentBgProp(colors.hoverBgColor) ||
    isNonTransparentBgProp(colors.activeBgColor) ||
    isNonTransparentBgProp(colors.pendingBgColor);

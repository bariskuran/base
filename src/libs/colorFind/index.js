import { baseStore } from "../baseStore";
import { byPath } from "../byPath";
import { colorConverter } from "../colorConverter";

const getTheme = () => {
    try {
        return baseStore.globalData.get?.()?.theme || {};
    } catch {
        return {};
    }
};

const toHex = (value, mode = "hex6") => {
    try {
        const c = colorConverter(value);
        if (!c) return undefined;
        const candidate = mode === "hex8" ? c.hex8 : c.hex6;
        if (typeof candidate !== "string") return undefined;
        const isValidHex = /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(candidate);
        return isValidHex ? candidate : undefined;
    } catch {
        return undefined;
    }
};

export const colorFind = (input, options = {}) => {
    const { theme: themeOverride, output = "hex6", _depth = 0 } = options;
    if (typeof input !== "string") return undefined;
    if (_depth > 6) return undefined;

    const globalTheme = getTheme();
    const theme = {
        ...globalTheme,
        ...(themeOverride || {}),
    };
    const key = input.trim();
    if (!key) return undefined;

    const tryThemeLookup = (t) => {
        if (!t || typeof t !== "object") return undefined;
        const fromPath = byPath.get(t, key);
        if (typeof fromPath === "string") {
            const hex = toHex(fromPath, output);
            if (hex) return hex;
            return colorFind(fromPath, { theme: t, output, _depth: _depth + 1 });
        }

        const fromKey = t?.[key];
        if (typeof fromKey === "string") {
            const hex = toHex(fromKey, output);
            if (hex) return hex;
            return colorFind(fromKey, { theme: t, output, _depth: _depth + 1 });
        }

        return undefined;
    };

    const fromMergedTheme = tryThemeLookup(theme);
    if (fromMergedTheme) return fromMergedTheme;


    const fromGlobalTheme = tryThemeLookup(globalTheme);
    if (fromGlobalTheme) return fromGlobalTheme;


    const directHex = toHex(key, output);
    if (directHex) return directHex;

    return undefined;
};

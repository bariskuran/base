import { baseStore } from "../@baseStore";
import { colorConverter } from "../colorConverter";
import { colorShader } from "../colorShader";
import { colorTinter } from "../colorTinter";
import { byPath } from "../byPath";

const getTheme = () => {
    try {
        return baseStore?.globalData?.get?.()?.theme || {};
    } catch {
        return {};
    }
};

const getFromTheme = (input) => {
    if (!input || typeof input !== "string") return undefined;

    const theme = getTheme();
    const color = input.trim();

    if (color.includes(".")) {
        const v = byPath.get(theme, color);
        return typeof v === "string" ? v : undefined;
    }

    const v = theme?.[color];
    return typeof v === "string" ? v : undefined;
};

const isValidCssColor = (color) => {
    if (typeof color !== "string") return false;
    if (typeof document === "undefined") return false;

    const s = new Option().style;
    s.color = "";
    s.color = color.trim();

    return s.color !== "";
};

const resolveColor = (input) => {
    if (!input || typeof input !== "string") return undefined;

    const color = input.trim();

    const themeColor = getFromTheme(color);
    if (themeColor && typeof themeColor === "string") return themeColor;

    if (isValidCssColor(color)) return color;

    return undefined;
};

const clamp = (num, min = 0, max = 100) => Math.min(max, Math.max(min, Number(num) || 0));

const getThemeContrastPair = () => {
    const theme = getTheme();

    const fgResolved = resolveColor(theme?.foreground);
    const bgResolved = resolveColor(theme?.background);

    const fgLum = fgResolved ? colorConverter(fgResolved)?.luminance : undefined;
    const bgLum = bgResolved ? colorConverter(bgResolved)?.luminance : undefined;

    let dark, light;

    if (fgResolved && fgLum != null && bgResolved && bgLum != null) {
        if (fgLum < bgLum) {
            dark = fgResolved;
            light = bgResolved;
        } else {
            dark = bgResolved;
            light = fgResolved;
        }
    } else {
        // eksik durum fallback
        dark = "#000000";
        light = "#ffffff";
    }

    return { dark, light };
};

const getAccessibleOpposite = (luminance) => {
    const { dark, light } = getThemeContrastPair();
    return luminance >= 0.5 ? dark : light;
};

/* ----------------------------- api builder ----------------------------- */

const buildColorApi = (resolvedColor) => {
    const converted = colorConverter(resolvedColor);
    if (!converted || !converted.hex8) return undefined;

    const {
        hex6,
        hex8,
        rgbArray,
        rgbString,
        rgbaArray,
        rgbaString,
        hsbArray,
        hsbString,
        hsbaArray,
        hsbaString,
        hslArray,
        hslString,
        hslaArray,
        hslaString,
        luminance,
        linearRgbaArray,
    } = converted;

    const api = {
        color: resolvedColor,

        hex6,
        hex8,
        rgbArray,
        rgbString,
        rgbaArray,
        rgbaString,
        hsbArray,
        hsbString,
        hsbaArray,
        hsbaString,
        hslArray,
        hslString,
        hslaArray,
        hslaString,
        luminance,
        linearRgbaArray,

        isLight: luminance >= 0.5,
        isDark: luminance < 0.5,

        shade(amount = 0) {
            return colorShader(hex8, clamp(amount));
        },

        tint(amount = 0) {
            return colorTinter(hex8, clamp(amount));
        },
    };

    for (let i = 1; i <= 100; i++) {
        Object.defineProperty(api, `shade${i}`, {
            enumerable: true,
            configurable: false,
            get() {
                return colorShader(hex8, i);
            },
        });
    }

    for (let i = 1; i <= 100; i++) {
        Object.defineProperty(api, `tint${i}`, {
            enumerable: true,
            configurable: false,
            get() {
                return colorTinter(hex8, i);
            },
        });
    }

    return api;
};

export const colorGet = (color) => {
    const resolvedColor = resolveColor(color);
    if (!resolvedColor) return undefined;

    const converted = colorConverter(resolvedColor);
    if (!converted || !converted.hex8) return undefined;

    const oppositeColor = getAccessibleOpposite(converted.luminance);

    return {
        color: resolvedColor,
        colorApi: buildColorApi(resolvedColor),

        opposite: oppositeColor,
        oppositeApi: buildColorApi(oppositeColor),
    };
};

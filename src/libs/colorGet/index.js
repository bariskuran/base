import { baseStore } from "../baseStore";
import { colorConverter } from "../colorConverter";
import { colorShader } from "../colorShader";
import { colorTinter } from "../colorTinter";
import { colorFind } from "../colorFind";

const getTheme = () => {
    try {
        return baseStore?.globalData?.get?.()?.theme || {};
    } catch {
        return {};
    }
};

const resolveColor = (input) => {
    return colorFind(input, { output: "hex8" });
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

        dark = "#000000";
        light = "#ffffff";
    }

    return { dark, light };
};

const getAccessibleOpposite = (luminance) => {
    const { dark, light } = getThemeContrastPair();
    return luminance >= 0.5 ? dark : light;
};

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
        isLight,
        isDark,
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
        isLight,
        isDark,

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

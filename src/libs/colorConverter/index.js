/*

colorConverter("#f00") => {
    return {
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
    }
}

*/

/**
 * Converts a color input to multiple formats (hex/rgb/rgba/hsl/hsla/hsb/hsba),
 * and computes relative luminance (WCAG).
 *
 * Supported inputs:
 * - string:
 *   - "#rgb", "#rgba", "#rrggbb", "#rrggbbaa"
 *   - "rgb(...)" / "rgba(...)" (both comma and modern space + "/" alpha syntax)
 *   - "hsl(...)" / "hsla(...)" (both comma and modern syntax)
 *   - "hsb(...)" / "hsba(...)" (your custom format)
 *   - CSS named colors (e.g. "red", "rebeccapurple") + "transparent" (browser only)
 * - object:
 *   { hex3, hex4, hex6, hex8, rgbArray, rgbString, rgbaArray, rgbaString, hslArray, hslString,
 *     hslaArray, hslaString, hsbArray, hsbString, hsbaArray, hsbaString, alpha, alphaPerc }
 *
 * Notes:
 * - CSS named colors are resolved via a tiny canvas trick. In non-browser environments (SSR),
 *   named colors are NOT resolved (function returns {} for those inputs).
 *
 * @param {string|Object} colorInput
 * @returns {Object} Converted formats (or {} if input cannot be parsed)
 */
export const colorConverter = (colorInput) => {
    // ---------- helpers (internal) ----------
    const hexToHexA = (color) => {
        if (typeof color !== "string") return "#00000000";
        color = color.trim();
        if (color.startsWith("#")) color = color.slice(1);

        if (color.length === 3) {
            color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
        } else if (color.length === 4) {
            color =
                color[0] +
                color[0] +
                color[1] +
                color[1] +
                color[2] +
                color[2] +
                color[3] +
                color[3];
        }

        if (color.length === 6) color += "ff";
        color = color.padStart(8, "0");

        return "#" + color.toLowerCase();
    };

    // Resolve CSS color names / "transparent" in the browser.
    // Returns a normalized CSS color string: "#rrggbb" or "rgba(r,g,b,a)" (or null if invalid/unavailable).
    const cssColorToNormalized = (input) => {
        if (typeof input !== "string") return null;
        if (typeof document === "undefined") return null;

        const s = input.trim();
        if (!s) return null;

        // If it's already a known format, skip (we'll parse it later)
        const lower = s.toLowerCase();
        if (
            lower.startsWith("#") ||
            lower.startsWith("rgb(") ||
            lower.startsWith("rgba(") ||
            lower.startsWith("hsl(") ||
            lower.startsWith("hsla(") ||
            lower.startsWith("hsb(") ||
            lower.startsWith("hsba(")
        ) {
            return null;
        }

        try {
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Reset then set
            ctx.fillStyle = "#000";
            ctx.fillStyle = s;

            // If invalid, browser keeps previous value ("#000000")
            if (ctx.fillStyle === "#000000" && lower !== "black") return null;

            // Typical outputs: "#rrggbb" (for names), or "rgba(0, 0, 0, 0)" for transparent
            return ctx.fillStyle;
        } catch {
            return null;
        }
    };

    const sRGBtoLinearRGB = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

    const hslaToRgba = (h, s, l, a) => {
        h = ((h % 360) + 360) % 360;
        h /= 360;
        s /= 100;
        l /= 100;

        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hueToRgb(p, q, h + 1 / 3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
    };

    const rgbaToHsla = (r, g, b, a) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;

        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (d !== 0) {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }

        return [Math.round(h), Math.round(s * 100), Math.round(l * 100), a];
    };

    const rgbaToHsba = (r, g, b, a) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;

        let h = 0;
        const v = max;
        const s = max === 0 ? 0 : d / max;

        if (d !== 0) {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }

        return [Math.round(h), Math.round(s * 100), Math.round(v * 100), a];
    };

    const hsbaToRgba = (h, s, v, a) => {
        h = ((h % 360) + 360) % 360;
        s /= 100;
        v /= 100;

        const k = (n) => (n + h / 60) % 6;
        const f = (n) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));

        return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1)), a];
    };

    const clamp01 = (x) => Math.min(1, Math.max(0, x));

    const parseRgbLike = (str) => {
        const s = String(str).trim().toLowerCase();

        const isRgba = s.startsWith("rgba");
        const isRgb = s.startsWith("rgb(") || isRgba;
        if (!isRgb) return null;

        const inside = s.slice(s.indexOf("(") + 1, s.lastIndexOf(")")).trim();
        const [left, right] = inside.split("/").map((x) => x && x.trim());

        const parts = left.split(/[\s,]+/).filter(Boolean);
        if (parts.length < 3) return null;

        const r = parseFloat(parts[0]);
        const g = parseFloat(parts[1]);
        const b = parseFloat(parts[2]);

        let a = 1;
        if (right != null) a = parseFloat(right);
        else if (isRgba && parts[3] != null) a = parseFloat(parts[3]);

        if ([r, g, b, a].some((x) => Number.isNaN(x))) return null;

        return [r, g, b, clamp01(a)];
    };

    const parseHslLike = (str) => {
        const s = String(str).trim().toLowerCase();
        const isHsla = s.startsWith("hsla");
        const isHsl = s.startsWith("hsl(") || isHsla;
        if (!isHsl) return null;

        const inside = s.slice(s.indexOf("(") + 1, s.lastIndexOf(")")).trim();
        const [left, right] = inside.split("/").map((x) => x && x.trim());
        const parts = left.split(/[\s,]+/).filter(Boolean);

        if (parts.length < 3) return null;

        const h = parseFloat(parts[0]);
        const sPerc = parseFloat(String(parts[1]).replace("%", ""));
        const lPerc = parseFloat(String(parts[2]).replace("%", ""));

        let a = 1;
        if (right != null) a = parseFloat(right);
        else if (isHsla && parts[3] != null) a = parseFloat(parts[3]);

        if ([h, sPerc, lPerc, a].some((x) => Number.isNaN(x))) return null;

        return [h, sPerc, lPerc, clamp01(a)];
    };

    const parseHsbLike = (str) => {
        const s = String(str).trim().toLowerCase();
        const isHsba = s.startsWith("hsba");
        const isHsb = s.startsWith("hsb(") || isHsba;
        if (!isHsb) return null;

        const inside = s.slice(s.indexOf("(") + 1, s.lastIndexOf(")")).trim();
        const [left, right] = inside.split("/").map((x) => x && x.trim());
        const parts = left.split(/[\s,]+/).filter(Boolean);

        if (parts.length < 3) return null;

        const h = parseFloat(parts[0]);
        const sPerc = parseFloat(String(parts[1]).replace("%", ""));
        const bPerc = parseFloat(String(parts[2]).replace("%", ""));

        let a = 1;
        if (right != null) a = parseFloat(right);
        else if (isHsba && parts[3] != null) a = parseFloat(parts[3]);

        if ([h, sPerc, bPerc, a].some((x) => Number.isNaN(x))) return null;

        return [h, sPerc, bPerc, clamp01(a)];
    };

    // ---------- normalize input ----------
    if (typeof colorInput === "string") {
        const normalized = cssColorToNormalized(colorInput);
        if (normalized) {
            // "#rrggbb" OR "rgba(...)"
            if (normalized.startsWith("#")) colorInput = { hex8: hexToHexA(normalized) };
            else colorInput = { rgbaString: normalized };
        } else {
            // keep old behavior for actual hex input; otherwise parsing will safely fail and return {}
            colorInput = { hex8: hexToHexA(colorInput) };
        }
    }

    const {
        hex3: inputhex3,
        hex4: inputhex4,
        hex6: inputhex6,
        hex8: inputhex8,
        rgbArray: inputrgbArray,
        rgbString: inputrgbString,
        rgbaArray: inputrgbaArray,
        rgbaString: inputrgbaString,
        hsbArray: inputhsbArray,
        hsbString: inputhsbString,
        hsbaArray: inputhsbaArray,
        hsbaString: inputhsbaString,
        hslArray: inputhslArray,
        hslString: inputhslString,
        hslaArray: inputhslaArray,
        hslaString: inputhslaString,
        alphaPerc: inputAlphaPerc,
        alpha: inputAlpha,
    } = colorInput || {};

    const alpha = inputAlphaPerc != null ? inputAlphaPerc / 100 : (inputAlpha ?? 1);

    let rgba;

    if (inputhex3) {
        const hex = inputhex3.replace("#", "");
        rgba = [
            parseInt(hex[0] + hex[0], 16),
            parseInt(hex[1] + hex[1], 16),
            parseInt(hex[2] + hex[2], 16),
            clamp01(alpha),
        ];
    } else if (inputhex4) {
        const hex = inputhex4.replace("#", "");
        rgba = [
            parseInt(hex[0] + hex[0], 16),
            parseInt(hex[1] + hex[1], 16),
            parseInt(hex[2] + hex[2], 16),
            clamp01(parseInt(hex[3] + hex[3], 16) / 255),
        ];
    } else if (inputhex6) {
        const hex = inputhex6.replace("#", "");
        rgba = [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
            clamp01(alpha),
        ];
    } else if (inputhex8) {
        const hex = inputhex8.replace("#", "");
        rgba = [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
            clamp01(parseInt(hex.slice(6, 8), 16) / 255),
        ];
    } else if (inputrgbArray) {
        rgba = [...inputrgbArray, clamp01(alpha)];
    } else if (inputrgbString) {
        const parsed = parseRgbLike(inputrgbString);
        if (!parsed) return {};
        rgba = [parsed[0], parsed[1], parsed[2], clamp01(alpha)];
    } else if (inputrgbaArray) {
        rgba = [...inputrgbaArray];
        rgba[3] = clamp01(rgba[3] ?? 1);
    } else if (inputrgbaString) {
        const parsed = parseRgbLike(inputrgbaString);
        if (!parsed) return {};
        rgba = parsed;
    } else if (inputhsbArray) {
        rgba = hsbaToRgba(...inputhsbArray, clamp01(alpha));
    } else if (inputhsbString) {
        const parsed = parseHsbLike(inputhsbString);
        if (!parsed) return {};
        rgba = hsbaToRgba(parsed[0], parsed[1], parsed[2], clamp01(alpha));
    } else if (inputhsbaArray) {
        rgba = hsbaToRgba(...inputhsbaArray);
    } else if (inputhsbaString) {
        const parsed = parseHsbLike(inputhsbaString);
        if (!parsed) return {};
        rgba = hsbaToRgba(parsed[0], parsed[1], parsed[2], parsed[3]);
    } else if (inputhslArray) {
        rgba = hslaToRgba(...inputhslArray, clamp01(alpha));
    } else if (inputhslString) {
        const parsed = parseHslLike(inputhslString);
        if (!parsed) return {};
        rgba = hslaToRgba(parsed[0], parsed[1], parsed[2], clamp01(alpha));
    } else if (inputhslaArray) {
        rgba = hslaToRgba(...inputhslaArray);
    } else if (inputhslaString) {
        const parsed = parseHslLike(inputhslaString);
        if (!parsed) return {};
        rgba = hslaToRgba(parsed[0], parsed[1], parsed[2], parsed[3]);
    } else {
        return {};
    }

    // normalize channels
    rgba = [
        Math.round(Math.min(255, Math.max(0, rgba[0]))),
        Math.round(Math.min(255, Math.max(0, rgba[1]))),
        Math.round(Math.min(255, Math.max(0, rgba[2]))),
        clamp01(rgba[3]),
    ];

    const hex6 =
        "#" +
        rgba
            .slice(0, 3)
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("");
    const hex8 =
        "#" +
        rgba
            .slice(0, 3)
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("") +
        Math.round(rgba[3] * 255)
            .toString(16)
            .padStart(2, "0");

    const rgbArray = rgba.slice(0, 3);
    const rgbString = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
    const rgbaArray = rgba;
    const rgbaString = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;

    const hsbaArray = rgbaToHsba(...rgbaArray);
    const hsbArray = hsbaArray.slice(0, 3);
    const hsbString = `hsb(${hsbArray[0]}, ${hsbArray[1]}%, ${hsbArray[2]}%)`;
    const hsbaString = `hsba(${hsbaArray[0]}, ${hsbaArray[1]}%, ${hsbaArray[2]}% / ${hsbaArray[3]})`;

    const hslaArray = rgbaToHsla(...rgbaArray);
    const hslArray = hslaArray.slice(0, 3);
    const hslString = `hsl(${hslArray[0]}, ${hslArray[1]}%, ${hslArray[2]}%)`;
    const hslaString = `hsla(${hslaArray[0]}, ${hslaArray[1]}%, ${hslaArray[2]}% / ${hslaArray[3]})`;

    const linearRgbaArray = [
        sRGBtoLinearRGB(rgba[0] / 255),
        sRGBtoLinearRGB(rgba[1] / 255),
        sRGBtoLinearRGB(rgba[2] / 255),
        rgba[3],
    ];

    const luminance = Number(
        (
            0.2126 * linearRgbaArray[0] +
            0.7152 * linearRgbaArray[1] +
            0.0722 * linearRgbaArray[2]
        ).toFixed(5),
    );

    return {
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
    };
};

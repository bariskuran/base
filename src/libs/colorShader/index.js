import { colorConverter } from "../colorConverter";
import { colorFind } from "../colorFind";

export const colorShader = (hex = "#f00", percent = 0) => {
    percent = Math.min(100, Math.max(0, percent));
    if (typeof hex !== "string") return undefined;
    hex = colorFind(hex, { output: "hex8" }) || hex;

    const normalizedHex = hex.replace("#", "").toLowerCase();

    if (normalizedHex.length === 8) {
        const rgbPart = normalizedHex.slice(0, 6);
        const alphaPart = normalizedHex.slice(6, 8);

        if (alphaPart !== "ff") {
            const currentAlpha = parseInt(alphaPart, 16);
            const currentAlphaPercent = (currentAlpha / 255) * 100;

            const nextAlphaPercent = Math.min(100, currentAlphaPercent + percent);
            const nextAlpha = Math.round((nextAlphaPercent / 100) * 255);
            const nextAlphaHex = nextAlpha.toString(16).padStart(2, "0");

            return `#${rgbPart}${nextAlphaHex}`;
        }
        hex = `#${rgbPart}`;
    }
    const rgb = colorConverter(hex)?.rgbArray;
    if (!Array.isArray(rgb) || rgb.length < 3) return undefined;
    let [r, g, b] = rgb;

    const factor = 1 - percent / 100;

    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);

    const newHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

    return `#${newHex}`;
};

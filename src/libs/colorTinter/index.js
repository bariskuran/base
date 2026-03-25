import { colorConverter } from "../colorConverter";

export const colorTinter = (hex = "#f00", percent = 0) => {
    percent = Math.min(100, Math.max(0, percent));

    const normalizedHex = hex.replace("#", "").toLowerCase();

    if (normalizedHex.length === 8) {
        const rgbPart = normalizedHex.slice(0, 6);
        const alphaPart = normalizedHex.slice(6, 8);

        if (alphaPart !== "ff") {
            const currentAlpha = parseInt(alphaPart, 16); // 0-255
            const currentAlphaPercent = (currentAlpha / 255) * 100;

            const nextAlphaPercent = Math.min(100, currentAlphaPercent + percent);
            const nextAlpha = Math.round((nextAlphaPercent / 100) * 255);
            const nextAlphaHex = nextAlpha.toString(16).padStart(2, "0");

            return `#${rgbPart}${nextAlphaHex}`;
        }

        hex = `#${rgbPart}`;
    }

    let [r, g, b] = colorConverter(hex).rgbArray;

    const factor = percent / 100;

    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);

    const newHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

    return `#${newHex}`;
};

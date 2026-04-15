import { colorConverter } from "../colorConverter";

export const colorAlpha = (color, alpha = 50) => {
    let alphaPerc;

    if (alpha <= 1) {
        alphaPerc = alpha * 100;
    } else {
        alphaPerc = alpha;
    }

    alphaPerc = Math.max(0, Math.min(100, alphaPerc));

    return colorConverter({
        hex6: colorConverter(color).hex6,
        alphaPerc,
    }).hex8;
};

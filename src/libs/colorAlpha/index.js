import { colorConverter } from "../colorConverter";

export const colorAlpha = (color, alpha = 50) =>
    colorConverter({
        hex6: colorConverter(color).hex6,
        alphaPerc: alpha <= 1 ? alpha * 100 : alpha,
    }).hex8;

import { colorConverter } from "../colorConverter";
import { colorGet } from "../colorGet";

const resolveColorInput = (input) => {
    if (typeof input !== "string") return input;

    const fromTheme = colorGet(input)?.color;
    return fromTheme ?? input;
};

export const colorAlpha = (color, alpha = 50) => {
    let alphaPerc;

    if (alpha <= 1) {
        alphaPerc = alpha * 100;
    } else {
        alphaPerc = alpha;
    }

    alphaPerc = Math.max(0, Math.min(100, alphaPerc));
    const resolvedColor = resolveColorInput(color);

    return colorConverter({
        hex6: colorConverter(resolvedColor).hex6,
        alphaPerc,
    }).hex8;
};

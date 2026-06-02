import { colorConverter } from "../colorConverter";

export const colorWcagValue = (colorA, colorB) => {
    if (!colorA || !colorB) return 0;

    const c1 = colorConverter(colorA);
    const c2 = colorConverter(colorB);

    if (typeof c1.luminance !== "number" || typeof c2.luminance !== "number") {
        return 0;
    }

    const ratio =
        (Math.max(c1.luminance, c2.luminance) + 0.05) /
        (Math.min(c1.luminance, c2.luminance) + 0.05);

    return Number(ratio.toFixed(4));
};

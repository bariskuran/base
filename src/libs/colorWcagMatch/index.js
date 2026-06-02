import { colorConverter } from "../colorConverter";
import { colorWcagValue } from "../colorWcagValue";
import { colorFind } from "../colorFind";

export const colorWcagMatch = (background, targetColor, wcagRatio = 4.5, opts = {}) => {
    const tolerance = typeof opts.tolerance === "number" ? opts.tolerance : 0.05;
    const step = typeof opts.step === "number" && opts.step > 0 ? opts.step : 1;

    const target = Number(Number(wcagRatio).toFixed(1));
    const minTarget = target - tolerance;
    const maxTarget = target + tolerance;

    const resolvedBackground = colorFind(background, { output: "hex8" }) || background;
    const resolvedTargetColor = colorFind(targetColor, { output: "hex8" }) || targetColor;

    const bg = colorConverter({ hex8: resolvedBackground });
    const l1 = bg?.luminance;

    const tone = colorConverter({ hex8: resolvedTargetColor });
    const [hue, sat] = tone?.hslArray || [];

    if (typeof l1 !== "number") {
        throw new Error(
            "colorWcagMatch: invalid background color (luminance could not be computed).",
        );
    }
    if (typeof hue !== "number" || typeof sat !== "number") {
        throw new Error("colorWcagMatch: invalid targetColor (HSL could not be computed).");
    }

    let best = {
        diff: Infinity,
        ratio: null,
        lightness: null,
        formats: null,
    };
    const getRatioFromLuminance = (lumA, lumB) =>
        Number(((Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05)).toFixed(4));

    for (let lig = 0; lig <= 100; lig += step) {
        const formats = colorConverter({ hslArray: [hue, sat, lig] });
        const l2 = formats?.luminance;

        if (typeof l2 !== "number") continue;

        const ratio = getRatioFromLuminance(l1, l2);
        const diff = Math.abs(ratio - target);

        if (ratio >= minTarget && ratio <= maxTarget) {
            return {
                color: formats.hex6,
                colorFormats: formats,
                finalRatio: Number(ratio.toFixed(2)),
                lightness: lig,
            };
        }

        if (diff < best.diff) {
            best = { diff, ratio, lightness: lig, formats };
        }
    }

    const finalFormats = best.formats || tone;
    const finalRatio =
        best.ratio ??
        (typeof finalFormats?.luminance === "number"
            ? getRatioFromLuminance(l1, finalFormats.luminance)
            : colorWcagValue(resolvedBackground, finalFormats.hex6));

    return {
        color: finalFormats.hex6,
        colorFormats: finalFormats,
        finalRatio: Number(Number(finalRatio).toFixed(2)),
        lightness: best.lightness ?? finalFormats?.hslArray?.[2] ?? null,
    };
};

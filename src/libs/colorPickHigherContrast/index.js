import { colorConverter } from "../colorConverter";
import { colorWcagValue } from "../colorWcagValue";
import { baseStore } from "../baseStore";

export const colorPickHigherContrast = (optionA, optionB, background) => {
    const { theme } = baseStore.globalData.get();
    const { background: sysBg, foreground: sysFg } = theme || {};

    const a = colorConverter(optionA ?? sysFg);
    const b = colorConverter(optionB ?? sysBg);

    const ratioA = colorWcagValue(background, a.hex6);
    const ratioB = colorWcagValue(background, b.hex6);

    const winner = ratioA >= ratioB ? a.hex6 : b.hex6;

    return { winner, ratioA, ratioB };
};

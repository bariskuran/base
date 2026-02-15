import { colorConverter } from "../colorConverter";
import { colorContrastRatio } from "../colorContrastRatio";
import { baseStore } from "../@baseStore";

/**
 *  * @example
 * import { pickHigherContrastColor } from "@bariskuran/base";
 * const { winner, ratioA, ratioB } = pickHigherContrastColor(optionA, optionB, background);
 */

/**
 * Picks the color (optionA or optionB) that yields the higher WCAG contrast
 * against a given background color.
 *
 * - Accepts any input supported by `colorConverter` (string or object).
 * - If an option is missing, it falls back to theme defaults.
 *
 * @param {string|Object|null|undefined} optionA - First candidate color
 * @param {string|Object|null|undefined} optionB - Second candidate color
 * @param {string|Object} background - Background color
 * @returns {{ winner: string, ratioA: number, ratioB: number }}
 */
export const colorPickHigherContrast = (optionA, optionB, background) => {
    const { theme } = baseStore.globalData.get();
    const { background: sysBg, foreground: sysFg } = theme || {};

    const bgLum = colorConverter(background).luminance;

    const a = colorConverter(optionA ?? sysFg);
    const b = colorConverter(optionB ?? sysBg);

    const ratioA = colorContrastRatio(bgLum, a.luminance);
    const ratioB = colorContrastRatio(bgLum, b.luminance);

    const winner = ratioA >= ratioB ? a.hex6 : b.hex6;

    return { winner, ratioA, ratioB };
};

import { colorConverter } from "../colorConverter";

/*

colorContrastRatio("#fff", "#111")

*/

/**
 * Calculates the WCAG contrast ratio between two colors.
 *
 * Accepted color formats:
 * - String: "#fff", "#ffffff", "rgb(...)", "rgba(...)", "hsl(...)", etc.
 * - Object: any format supported by `colorConverter`
 *
 * The function internally converts colors to relative luminance
 * and returns a WCAG contrast ratio.
 *
 * WCAG reference:
 * - 4.5:1 → normal text (AA)
 * - 3:1   → large text (AA)
 * - 7:1   → normal text (AAA)
 *
 * @param {string|Object} colorA - First color
 * @param {string|Object} colorB - Second color
 * @returns {number} Contrast ratio rounded to 4 decimals
 */
export const colorContrastRatio = (colorA, colorB) => {
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

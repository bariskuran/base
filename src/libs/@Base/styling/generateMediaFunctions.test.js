import { describe, it, expect } from "vitest";
import { generateMediaFunctions } from "./generateMediaFunctions";

const flattenCss = (value) => {
    if (value == null || typeof value === "boolean") return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value.join === "function") return value.join("");
    if (Array.isArray(value)) return value.map(flattenCss).join("");
    return "";
};

describe("generateMediaFunctions", () => {
    it("exposes vertical and square helpers on theme.responsive", () => {
        const media = generateMediaFunctions({
            maxAspRatio: 0.5,
            minAspRatio: 3,
            breakpoints: {
                tablet: [601],
                desktop: [961],
                large: [1441],
                uhd: [1921],
                uhd8: [3841],
            },
        });

        expect(typeof media.vertical).toBe("function");
        expect(typeof media.square).toBe("function");
        expect(typeof media.responsive.vertical).toBe("function");
        expect(typeof media.responsive.square).toBe("function");
    });

    it("vertical uses max-aspect-ratio from maxAspRatio", () => {
        const media = generateMediaFunctions({ maxAspRatio: 0.5 });
        const cssText = flattenCss(media.vertical("vertical-styles"));

        expect(cssText).toContain("max-aspect-ratio: 0.5");
        expect(cssText).toContain("vertical-styles");
    });

    it("square targets 1/1 aspect ratio", () => {
        const media = generateMediaFunctions();
        const cssText = flattenCss(media.square("square-styles"));

        expect(cssText).toContain("aspect-ratio: 1/1");
        expect(cssText).toContain("square-styles");
    });

    it("responsive combinator can mix width and ratio axes", () => {
        const media = generateMediaFunctions({ maxAspRatio: 0.5 });
        const cssText = flattenCss(media.responsive("tablet, vertical", "mixed-styles"));

        expect(cssText).toContain("min-width: 601px");
        expect(cssText).toContain("max-aspect-ratio: 0.5");
        expect(cssText).toContain("mixed-styles");
    });
});

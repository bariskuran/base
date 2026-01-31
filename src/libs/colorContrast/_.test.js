import { describe, it, expect, vi, beforeEach } from "vitest";

const colorConverterSpy = vi.fn();
const getContrastRatioSpy = vi.fn();

vi.mock("../colorConverter", () => ({
    colorConverter: (...args) => colorConverterSpy(...args),
}));

vi.mock("../getContrastRatio", () => ({
    getContrastRatio: (...args) => getContrastRatioSpy(...args),
}));

import { colorContrast } from "./index";

describe("colorContrast", () => {
    beforeEach(() => {
        colorConverterSpy.mockReset();
        getContrastRatioSpy.mockReset();

        colorConverterSpy.mockImplementation((input) => {
            if (input?.hex6 === "bg") return { hex6: "bg", luminance: 0.1 };

            if (input?.hex6 === "tone")
                return {
                    hex6: "tone",
                    luminance: 0.2,
                    hslArray: [10, 20, 30],
                };

            if (Array.isArray(input?.hslArray)) {
                const [h, s, l] = input.hslArray;
                return {
                    hex6: `#L${l}`,
                    luminance: typeof l === "number" ? l / 100 : undefined,
                    hslArray: [h, s, l],
                };
            }

            return {};
        });

        getContrastRatioSpy.mockImplementation((l1, l2) => {
            return Number((1 + Math.abs(l1 - l2) * 10).toFixed(4));
        });
    });

    it("returns early when it finds a lightness within tolerance band", () => {
        getContrastRatioSpy.mockImplementation((l1, l2) => {
            const lig = Math.round(Number(l2) * 100);
            if (lig === 50) return 4.52;
            return 1.1;
        });

        const out = colorContrast("bg", "tone", 4.5, { tolerance: 0.05, step: 1 });

        expect(out).toEqual(
            expect.objectContaining({
                color: "#L50",
                finalRatio: 4.52,
                lightness: 50,
            }),
        );

        const calls = colorConverterSpy.mock.calls.map((c) => c[0]);
        const toneCall = calls.find((x) => x?.hex6 === "tone");
        expect(toneCall).toBeTruthy();

        const anyHslCall = calls.find((x) => Array.isArray(x?.hslArray));
        expect(anyHslCall).toBeTruthy();
    });

    it("returns the closest match if nothing falls into tolerance band", () => {
        getContrastRatioSpy.mockImplementation((l1, l2) => {
            const lig = Math.round(Number(l2) * 100);
            return lig / 10;
        });

        const out = colorContrast("bg", "tone", 7.0, { tolerance: 0.01, step: 10 });

        expect(out.color).toBe("#L70");
        expect(out.lightness).toBe(70);
        expect(out.finalRatio).toBe(7.0);
    });

    it("normalizes expectedRatio to 1 decimal for target comparison", () => {
        getContrastRatioSpy.mockImplementation((l1, l2) => {
            const lig = Math.round(Number(l2) * 100);
            if (lig === 40) return 4.35;
            return 1.0;
        });

        const out = colorContrast("bg", "tone", 4.34, { tolerance: 0.05, step: 1 });

        expect(out.lightness).toBe(40);
        expect(out.finalRatio).toBe(4.35);
    });

    it("uses step=1 when opts.step is invalid", () => {
        getContrastRatioSpy.mockImplementation(() => 0);

        colorContrast("bg", "tone", 4.5, { step: 0, tolerance: 0 });

        const hslCalls = colorConverterSpy.mock.calls.filter((c) => Array.isArray(c[0]?.hslArray));
        expect(hslCalls.length).toBe(101);
    });

    it("throws when background luminance cannot be computed", () => {
        colorConverterSpy.mockImplementation((input) => {
            if (input?.hex6 === "bg") return { hex6: "bg", luminance: undefined };
            if (input?.hex6 === "tone") return { hex6: "tone", hslArray: [10, 20, 30] };
            if (Array.isArray(input?.hslArray))
                return { hex6: "#L0", luminance: 0.1, hslArray: input.hslArray };
            return {};
        });

        expect(() => colorContrast("bg", "tone", 4.5)).toThrow(/invalid background color/i);
    });

    it("throws when expectedTone HSL cannot be computed", () => {
        colorConverterSpy.mockImplementation((input) => {
            if (input?.hex6 === "bg") return { hex6: "bg", luminance: 0.1 };
            if (input?.hex6 === "tone")
                return { hex6: "tone", luminance: 0.2, hslArray: [undefined, 20, 30] };
            if (Array.isArray(input?.hslArray))
                return { hex6: "#L0", luminance: 0.1, hslArray: input.hslArray };
            return {};
        });

        expect(() => colorContrast("bg", "tone", 4.5)).toThrow(/invalid expectedTone/i);
    });

    it("keeps Hue and Saturation fixed while scanning Lightness", () => {
        colorContrast("bg", "tone", 4.5, { step: 20 });

        const hslCalls = colorConverterSpy.mock.calls
            .map((c) => c[0])
            .filter((x) => Array.isArray(x?.hslArray));

        expect(hslCalls.length).toBeGreaterThan(0);

        for (const call of hslCalls) {
            const [h, s] = call.hslArray;
            expect(h).toBe(10);
            expect(s).toBe(20);
        }
    });
});

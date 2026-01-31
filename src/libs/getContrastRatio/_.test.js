import { describe, it, expect, vi, beforeEach } from "vitest";

import { getContrastRatio } from "./index";
import { colorConverter } from "../colorConverter";

vi.mock("../colorConverter", () => ({
    colorConverter: vi.fn(),
}));

describe("getContrastRatio", () => {
    beforeEach(() => {
        colorConverter.mockClear();
    });

    it("returns 0 when one of the colors is missing", () => {
        expect(getContrastRatio(null, "#fff")).toBe(0);
        expect(getContrastRatio("#000", null)).toBe(0);
        expect(getContrastRatio(undefined, undefined)).toBe(0);
    });

    it("returns 0 when luminance cannot be computed", () => {
        colorConverter.mockReturnValueOnce({}).mockReturnValueOnce({ luminance: 0.5 });

        const out = getContrastRatio("#aaa", "#bbb");
        expect(out).toBe(0);
    });

    it("calculates correct contrast ratio when luminance values are valid", () => {
        colorConverter.mockReturnValueOnce({ luminance: 1 }).mockReturnValueOnce({ luminance: 0 });

        const out = getContrastRatio("#fff", "#000");
        expect(out).toBe(Number((1.05 / 0.05).toFixed(4)));
    });

    it("is order-independent", () => {
        colorConverter
            .mockReturnValueOnce({ luminance: 0.2 })
            .mockReturnValueOnce({ luminance: 0.8 });

        const r1 = getContrastRatio("a", "b");

        colorConverter
            .mockReturnValueOnce({ luminance: 0.8 })
            .mockReturnValueOnce({ luminance: 0.2 });

        const r2 = getContrastRatio("b", "a");

        expect(r1).toBe(r2);
    });

    it("rounds the result to 4 decimal places", () => {
        colorConverter
            .mockReturnValueOnce({ luminance: 0.123456 })
            .mockReturnValueOnce({ luminance: 0.654321 });

        const out = getContrastRatio("a", "b");
        expect(out.toString().split(".")[1].length).toBeLessThanOrEqual(4);
    });

    it("calls colorConverter for both inputs", () => {
        colorConverter
            .mockReturnValueOnce({ luminance: 0.4 })
            .mockReturnValueOnce({ luminance: 0.6 });

        getContrastRatio("#111", "#eee");

        expect(colorConverter).toHaveBeenCalledTimes(2);
        expect(colorConverter).toHaveBeenNthCalledWith(1, "#111");
        expect(colorConverter).toHaveBeenNthCalledWith(2, "#eee");
    });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../colorConverter", () => ({
    colorConverter: vi.fn(),
}));

vi.mock("../getContrastRatio", () => ({
    getContrastRatio: vi.fn(),
}));

vi.mock("../@baseStore", () => ({
    baseStore: {
        globalData: {
            get: vi.fn(),
        },
    },
}));

import { colorConverter } from "../colorConverter";
import { getContrastRatio } from "../getContrastRatio";
import { baseStore } from "../@baseStore";
import { pickHigherContrastColor } from "./index";

describe("pickHigherContrastColor", () => {
    beforeEach(() => {
        colorConverter.mockReset();
        getContrastRatio.mockReset();
        baseStore.globalData.get.mockReset();
    });

    it("returns optionA when it has higher contrast", () => {
        baseStore.globalData.get.mockReturnValue({
            theme: { background: "#000000", foreground: "#ffffff" },
        });

        colorConverter
            .mockReturnValueOnce({ luminance: 0.2 }) // background
            .mockReturnValueOnce({ luminance: 0.9, hex6: "#aaaaaa" }) // optionA
            .mockReturnValueOnce({ luminance: 0.4, hex6: "#bbbbbb" }); // optionB

        getContrastRatio
            .mockReturnValueOnce(7) // ratioA
            .mockReturnValueOnce(3); // ratioB

        const out = pickHigherContrastColor("#aaaaaa", "#bbbbbb", "#000000");

        expect(out).toEqual({
            winner: "#aaaaaa",
            ratioA: 7,
            ratioB: 3,
        });
    });

    it("returns optionB when it has higher contrast", () => {
        baseStore.globalData.get.mockReturnValue({
            theme: { background: "#000000", foreground: "#ffffff" },
        });

        colorConverter
            .mockReturnValueOnce({ luminance: 0.2 }) // background
            .mockReturnValueOnce({ luminance: 0.3, hex6: "#aaaaaa" }) // optionA
            .mockReturnValueOnce({ luminance: 0.9, hex6: "#bbbbbb" }); // optionB

        getContrastRatio
            .mockReturnValueOnce(2) // ratioA
            .mockReturnValueOnce(6); // ratioB

        const out = pickHigherContrastColor("#aaaaaa", "#bbbbbb", "#000000");

        expect(out).toEqual({
            winner: "#bbbbbb",
            ratioA: 2,
            ratioB: 6,
        });
    });

    it("falls back to theme colors when options are missing", () => {
        baseStore.globalData.get.mockReturnValue({
            theme: { background: "#111111", foreground: "#eeeeee" },
        });

        colorConverter
            .mockReturnValueOnce({ luminance: 0.1 }) // background
            .mockReturnValueOnce({ luminance: 0.8, hex6: "#eeeeee" }) // optionA fallback
            .mockReturnValueOnce({ luminance: 0.2, hex6: "#111111" }); // optionB fallback

        getContrastRatio.mockReturnValueOnce(5).mockReturnValueOnce(1);

        const out = pickHigherContrastColor(undefined, undefined, "#000000");

        expect(out.winner).toBe("#eeeeee");
        expect(out.ratioA).toBe(5);
        expect(out.ratioB).toBe(1);
    });
});

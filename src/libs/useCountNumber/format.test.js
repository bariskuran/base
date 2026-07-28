import { describe, expect, it } from "vitest";
import { formatCountNumber, resolveCountLocale, snapToStep } from "./format";

describe("formatCountNumber", () => {
    it("pads decimals as string", () => {
        expect(formatCountNumber(2, { decimal: 2, enableLocale: false })).toBe("2.00");
        expect(formatCountNumber(1.25, { decimal: 2, enableLocale: false })).toBe("1.25");
    });

    it("returns number when decimal is 0 and locale off", () => {
        expect(formatCountNumber(12.6, { decimal: 0, enableLocale: false })).toBe(13);
    });

    it("locale formats with fraction digits", () => {
        const value = formatCountNumber(1200.5, {
            decimal: 2,
            enableLocale: true,
            language: "en",
        });
        expect(typeof value).toBe("string");
        expect(value.replace(/[^\d.]/g, "").endsWith("00") || value.includes("1")).toBe(true);
    });
});

describe("resolveCountLocale", () => {
    it("maps language codes", () => {
        expect(resolveCountLocale("tr")).toBe("tr-TR");
        expect(resolveCountLocale("en")).toBe("en-US");
    });
});

describe("snapToStep", () => {
    it("snaps to nearest step from start", () => {
        expect(snapToStep(12, 0, 5)).toBe(10);
        expect(snapToStep(13, 0, 5)).toBe(15);
    });
});

describe("resolveStartList / resolveEndList", () => {
    it("maps shared start across ends", async () => {
        const { resolveStartList, resolveEndList } = await import("./format");
        expect(resolveEndList([10, 20, undefined])).toEqual([10, 20, 0]);
        expect(resolveStartList(5, 3)).toEqual([5, 5, 5]);
        expect(resolveStartList([1, 2], 3)).toEqual([1, 2, 0]);
        expect(resolveStartList(undefined, 2)).toEqual([0, 0]);
    });
});

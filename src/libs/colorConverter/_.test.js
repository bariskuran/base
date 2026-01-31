import { describe, it, expect } from "vitest";
import { colorConverter } from "./index";

describe("colorConverter", () => {
    it("returns {} for unparseable input", () => {
        expect(colorConverter()).toEqual({});
        expect(colorConverter(null)).toEqual({});
        expect(colorConverter({})).toEqual({});
        expect(colorConverter({ rgbString: "nope" })).toEqual({});
        expect(colorConverter({ hslString: "nope" })).toEqual({});
        expect(colorConverter({ hsbString: "nope" })).toEqual({});
    });

    it("parses hex3 and normalizes to hex6/hex8", () => {
        const out = colorConverter("#f00");
        expect(out.hex6).toBe("#ff0000");
        expect(out.hex8).toBe("#ff0000ff");
        expect(out.rgbArray).toEqual([255, 0, 0]);
        expect(out.rgbaArray).toEqual([255, 0, 0, 1]);
    });

    it("parses hex4 and uses embedded alpha", () => {
        const out = colorConverter("#0008");
        expect(out.hex6).toBe("#000000");
        expect(out.hex8.startsWith("#000000")).toBe(true);
        expect(out.rgbaArray[0]).toBe(0);
        expect(out.rgbaArray[1]).toBe(0);
        expect(out.rgbaArray[2]).toBe(0);
        expect(out.rgbaArray[3]).toBeCloseTo(0.53, 2);
    });

    it("parses hex6 and applies alpha from alpha/alphaPerc when provided", () => {
        const out1 = colorConverter({ hex6: "#112233", alpha: 0.2 });
        expect(out1.hex6).toBe("#112233");
        expect(out1.rgbaArray[3]).toBeCloseTo(0.2, 5);

        const out2 = colorConverter({ hex6: "112233", alphaPerc: 20 });
        expect(out2.hex6).toBe("#112233");
        expect(out2.rgbaArray[3]).toBeCloseTo(0.2, 5);
    });

    it("parses hex8 and uses embedded alpha (ignores alpha override)", () => {
        const out = colorConverter({ hex8: "#11223380", alpha: 0.1, alphaPerc: 10 });
        expect(out.hex6).toBe("#112233");
        expect(out.rgbaArray[3]).toBeCloseTo(0.5, 2);
    });

    it("parses rgbString and clamps alpha override", () => {
        const out = colorConverter({ rgbString: "rgb(10, 20, 30)", alpha: 2 });
        expect(out.rgbArray).toEqual([10, 20, 30]);
        expect(out.rgbaArray[3]).toBe(1);
        expect(out.hex6).toBe("#0a141e");
    });

    it("parses rgbaString (comma syntax) and keeps embedded alpha", () => {
        const out = colorConverter({ rgbaString: "rgba(10, 20, 30, 0.25)" });
        expect(out.rgbArray).toEqual([10, 20, 30]);
        expect(out.rgbaArray[3]).toBeCloseTo(0.25, 5);
        expect(out.hex6).toBe("#0a141e");
    });

    it("parses rgbaString (space + slash syntax)", () => {
        const out = colorConverter({ rgbaString: "rgba(10 20 30 / 0.25)" });
        expect(out.rgbArray).toEqual([10, 20, 30]);
        expect(out.rgbaArray[3]).toBeCloseTo(0.25, 5);
    });

    it("accepts rgbArray and applies alpha override", () => {
        const out = colorConverter({ rgbArray: [10, 20, 30], alphaPerc: 50 });
        expect(out.rgbArray).toEqual([10, 20, 30]);
        expect(out.rgbaArray[3]).toBeCloseTo(0.5, 5);
    });

    it("accepts rgbaArray and clamps its own alpha", () => {
        const out = colorConverter({ rgbaArray: [10, 20, 30, 2] });
        expect(out.rgbaArray).toEqual([10, 20, 30, 1]);
    });

    it("parses hslString and produces consistent rgb/hex", () => {
        const out = colorConverter({ hslString: "hsl(0, 100%, 50%)" });
        expect(out.hex6).toBe("#ff0000");
        expect(out.rgbArray).toEqual([255, 0, 0]);
        expect(Array.isArray(out.hslArray)).toBe(true);
        expect(out.hslArray[0]).toBe(0);
    });

    it("parses hslaString and keeps embedded alpha", () => {
        const out = colorConverter({ hslaString: "hsla(0 100% 50% / 0.25)" });
        expect(out.hex6).toBe("#ff0000");
        expect(out.rgbaArray[3]).toBeCloseTo(0.25, 5);
        expect(out.hslaArray[3]).toBeCloseTo(0.25, 5);
    });

    it("accepts hslArray and applies alpha override", () => {
        const out = colorConverter({ hslArray: [0, 100, 50], alpha: 0.4 });
        expect(out.hex6).toBe("#ff0000");
        expect(out.rgbaArray[3]).toBeCloseTo(0.4, 5);
    });

    it("parses hsbString and produces consistent outputs", () => {
        const out = colorConverter({ hsbString: "hsb(0, 100%, 100%)" });
        expect(out.hex6).toBe("#ff0000");
        expect(out.rgbArray).toEqual([255, 0, 0]);
        expect(Array.isArray(out.hsbArray)).toBe(true);
        expect(out.hsbArray[0]).toBe(0);
    });

    it("parses hsbaString and keeps embedded alpha", () => {
        const out = colorConverter({ hsbaString: "hsba(0 100% 100% / 0.3)" });
        expect(out.hex6).toBe("#ff0000");
        expect(out.rgbaArray[3]).toBeCloseTo(0.3, 5);
        expect(out.hsbaArray[3]).toBeCloseTo(0.3, 5);
    });

    it("computes luminance as a number in [0..1]", () => {
        const outW = colorConverter("#ffffff");
        const outB = colorConverter("#000000");

        expect(typeof outW.luminance).toBe("number");
        expect(outW.luminance).toBeGreaterThanOrEqual(0);
        expect(outW.luminance).toBeLessThanOrEqual(1);

        expect(typeof outB.luminance).toBe("number");
        expect(outB.luminance).toBeGreaterThanOrEqual(0);
        expect(outB.luminance).toBeLessThanOrEqual(1);

        expect(outW.luminance).toBeGreaterThan(outB.luminance);
    });

    it("returns linearRgbaArray with 4 entries", () => {
        const out = colorConverter("#336699");
        expect(Array.isArray(out.linearRgbaArray)).toBe(true);
        expect(out.linearRgbaArray.length).toBe(4);
        expect(out.linearRgbaArray[3]).toBe(1);
    });
});

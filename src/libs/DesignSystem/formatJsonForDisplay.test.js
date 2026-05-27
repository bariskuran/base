import { describe, it, expect } from "vitest";
import { formatJsonForDisplay, coerceToCodeText } from "./formatJsonForDisplay";

describe("formatJsonForDisplay", () => {
    it("handles circular objects without throwing", () => {
        const obj = { a: 1 };
        obj.self = obj;
        expect(() => formatJsonForDisplay(obj)).not.toThrow();
        expect(formatJsonForDisplay(obj)).toContain("[Circular]");
    });

    it("coerces functions to string for code panels", () => {
        const fn = () => {};
        expect(typeof coerceToCodeText(fn)).toBe("string");
        expect(coerceToCodeText(fn).length).toBeGreaterThan(0);
    });
});

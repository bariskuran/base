import { describe, it, expect } from "vitest";
import { typeOf } from "./index";

describe("typeOf", () => {
    it("returns undefined when called with no args", () => {
        expect(typeOf()).toBeUndefined();
    });

    it("returns native typeof values for primitives", () => {
        expect(typeOf(123)).toBe("number");
        expect(typeOf("hello")).toBe("string");
        expect(typeOf(true)).toBe("boolean");
        expect(typeOf(undefined)).toBe("undefined");
        expect(typeOf(Symbol("x"))).toBe("symbol");
        expect(typeOf(10n)).toBe("bigint");
    });

    it("returns 'null' for null", () => {
        expect(typeOf(null)).toBe("null");
    });

    it("returns 'array' for arrays", () => {
        expect(typeOf([])).toBe("array");
        expect(typeOf([1, 2, 3])).toBe("array");
    });

    it("returns 'object' for plain objects", () => {
        expect(typeOf({})).toBe("object");
        expect(typeOf({ a: 1 })).toBe("object");
    });

    it("returns 'function' for functions", () => {
        expect(typeOf(() => {})).toBe("function");
        expect(typeOf(function f() {})).toBe("function");
    });

    it("supports multiple args and preserves order", () => {
        expect(typeOf(1, "a", null, [], {}, () => {}, undefined)).toEqual([
            "number",
            "string",
            "null",
            "array",
            "object",
            "function",
            "undefined",
        ]);
    });

    it("returns a single string (not array) when exactly one arg is provided", () => {
        const out = typeOf("x");
        expect(out).toBe("string");
        expect(Array.isArray(out)).toBe(false);
    });
});

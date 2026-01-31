import { describe, it, expect } from "vitest";
import { shallowEqual } from "./index";

describe("shallowEqual", () => {
    it("returns true for Object.is equal primitives", () => {
        expect(shallowEqual(1, 1)).toBe(true);
        expect(shallowEqual("a", "a")).toBe(true);
        expect(shallowEqual(true, true)).toBe(true);
        expect(shallowEqual(null, null)).toBe(true);
    });

    it("handles Object.is edge cases", () => {
        expect(shallowEqual(NaN, NaN)).toBe(true);
        expect(shallowEqual(0, -0)).toBe(false);
    });

    it("returns false for different types", () => {
        expect(shallowEqual([], {})).toBe(false);
        expect(shallowEqual(null, {})).toBe(false);
        expect(shallowEqual("1", 1)).toBe(false);
    });

    it("compares arrays shallowly by length and index via Object.is", () => {
        expect(shallowEqual([1, 2], [1, 2])).toBe(true);
        expect(shallowEqual([1, 2], [1, 3])).toBe(false);
        expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("treats nested references as values (shallow)", () => {
        const obj = { x: 1 };
        expect(shallowEqual([obj], [obj])).toBe(true);
        expect(shallowEqual([obj], [{ x: 1 }])).toBe(false);

        const arr = [1];
        expect(shallowEqual({ a: arr }, { a: arr })).toBe(true);
        expect(shallowEqual({ a: arr }, { a: [1] })).toBe(false);
    });

    it("compares plain objects shallowly by own keys and Object.is values", () => {
        expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
        expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("returns false for non-plain objects even if they look identical", () => {
        expect(shallowEqual(new Date(0), new Date(0))).toBe(false);
        expect(shallowEqual(new Map([["a", 1]]), new Map([["a", 1]]))).toBe(false);
        expect(
            shallowEqual(
                () => {},
                () => {},
            ),
        ).toBe(false);

        class A {
            constructor(x) {
                this.x = x;
            }
        }
        expect(shallowEqual(new A(1), new A(1))).toBe(false);
    });

    it("returns true for the same reference regardless of type", () => {
        const d = new Date(0);
        expect(shallowEqual(d, d)).toBe(true);

        const m = new Map();
        expect(shallowEqual(m, m)).toBe(true);
    });

    it("supports null-prototype plain objects", () => {
        const a = Object.create(null);
        a.x = 1;
        const b = Object.create(null);
        b.x = 1;

        expect(shallowEqual(a, b)).toBe(true);
        expect(shallowEqual(a, { x: 1 })).toBe(true);
    });
});

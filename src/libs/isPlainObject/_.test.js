import { describe, it, expect } from "vitest";
import { isPlainObject } from "./index";

describe("isPlainObject", () => {
    it("returns true for a normal plain object", () => {
        expect(isPlainObject({ a: 1 })).toBe(true);
    });

    it("returns true for a null-prototype object", () => {
        const obj = Object.create(null);
        obj.a = 1;
        expect(isPlainObject(obj)).toBe(true);
    });

    it("returns false for arrays", () => {
        expect(isPlainObject([])).toBe(false);
    });

    it("returns false for Date instances", () => {
        expect(isPlainObject(new Date())).toBe(false);
    });

    it("returns false for Map instances", () => {
        expect(isPlainObject(new Map())).toBe(false);
    });

    it("returns false for Set instances", () => {
        expect(isPlainObject(new Set())).toBe(false);
    });

    it("returns false for functions", () => {
        expect(isPlainObject(function () {})).toBe(false);
        expect(isPlainObject(() => {})).toBe(false);
    });

    it("returns false for Error instances", () => {
        expect(isPlainObject(new Error("x"))).toBe(false);
    });

    it("returns false for null", () => {
        expect(isPlainObject(null)).toBe(false);
    });

    it("returns false for primitive values", () => {
        expect(isPlainObject(1)).toBe(false);
        expect(isPlainObject("a")).toBe(false);
        expect(isPlainObject(true)).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
    });
});

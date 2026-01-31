import { describe, it, expect } from "vitest";
import { byPath } from "./index";

describe("byPath.get", () => {
    it("gets nested object value", () => {
        const obj = { a: { b: 1 } };
        expect(byPath.get(obj, "a.b")).toBe(1);
    });

    it("gets nested array value", () => {
        const obj = { items: [{ name: "Alice" }] };
        expect(byPath.get(obj, "items.0.name")).toBe("Alice");
    });

    it("returns undefined for missing path", () => {
        const obj = { a: {} };
        expect(byPath.get(obj, "a.b.c")).toBeUndefined();
    });

    it("returns undefined for invalid input", () => {
        expect(byPath.get(null, "a.b")).toBeUndefined();
        expect(byPath.get({}, "")).toBeUndefined();
    });
});

describe("byPath.set (immutable)", () => {
    it("sets nested object value immutably", () => {
        const s1 = {};
        const s2 = byPath.set(s1, "a.b.c", 1);

        expect(s2).toEqual({ a: { b: { c: 1 } } });
        expect(s1).toEqual({});
        expect(s1).not.toBe(s2);
    });

    it("creates arrays when path segment is numeric", () => {
        const s1 = {};
        const s2 = byPath.set(s1, "items.0.name", "Alice");

        expect(s2).toEqual({ items: [{ name: "Alice" }] });
    });

    it("reuses untouched branches", () => {
        const s1 = { a: { x: 1 }, b: { y: 2 } };
        const s2 = byPath.set(s1, "a.z", 3);

        expect(s2.a).not.toBe(s1.a);
        expect(s2.b).toBe(s1.b);
    });
});

describe("byPath.set (mutable)", () => {
    it("mutates object when enableDirectUpdate is true", () => {
        const s = {};
        const out = byPath.set(s, "a.b", 1, true);

        expect(out).toBe(s);
        expect(s).toEqual({ a: { b: 1 } });
    });

    it("falls back to immutable mode for non-container roots", () => {
        const s = 5;
        const out = byPath.set(s, "a.b", 1, true);

        expect(out).toEqual({ a: { b: 1 } });
    });
});

describe("byPath.delete (immutable)", () => {
    it("deletes nested object key immutably", () => {
        const s1 = { a: { b: { c: 1, d: 2 } } };
        const s2 = byPath.delete(s1, "a.b.c");

        expect(s2).toEqual({ a: { b: { d: 2 } } });
        expect(s1).toEqual({ a: { b: { c: 1, d: 2 } } });
    });

    it("sets array index to undefined instead of reindexing", () => {
        const s1 = { items: ["a", "b", "c"] };
        const s2 = byPath.delete(s1, "items.1");

        expect(s2.items.length).toBe(3);
        expect(s2.items[1]).toBeUndefined();
    });

    it("returns original object if path does not exist", () => {
        const s = { a: { b: 1 } };
        const out = byPath.delete(s, "a.x.y");

        expect(out).toBe(s);
    });
});

describe("byPath.delete (mutable)", () => {
    it("mutates object when enableDirectUpdate is true", () => {
        const s = { a: { b: { c: 1 } } };
        const out = byPath.delete(s, "a.b.c", true);

        expect(out).toBe(s);
        expect(s).toEqual({ a: { b: {} } });
    });

    it("does nothing when path does not exist", () => {
        const s = { a: { b: 1 } };
        const out = byPath.delete(s, "a.x", true);

        expect(out).toBe(s);
        expect(s).toEqual({ a: { b: 1 } });
    });
});

import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { use } from "./index.js";

const createTestStore = (initial) => {
    let state = initial;
    let version = 0;
    const listeners = new Set();

    return {
        get: () => state,
        getVersion: () => version,
        set: (next) => {
            state = typeof next === "function" ? next(state) : next;
            version += 1;
            for (const l of listeners) l();
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
};

describe("baseStore.use", () => {
    it("throws for invalid store", () => {
        expect(() => renderHook(() => use(null))).toThrow("Unknown baseStore.");
        expect(() => renderHook(() => use({}))).toThrow("Unknown baseStore.");
        expect(() => renderHook(() => use({ get: () => ({}), subscribe: null }))).toThrow(
            "Unknown baseStore.",
        );
    });

    it("returns full state when selector is not provided", () => {
        const store = createTestStore({ a: 1, b: 2 });

        const { result } = renderHook(() => use(store));
        expect(result.current).toEqual({ a: 1, b: 2 });

        act(() => {
            store.set({ a: 2, b: 2 });
        });

        expect(result.current).toEqual({ a: 2, b: 2 });
    });

    it("returns selected value and updates only when selection changes", () => {
        const store = createTestStore({ a: 1, b: 2, nested: { x: 10 } });

        const { result } = renderHook(() => use(store, (s) => s.a));
        expect(result.current).toBe(1);

        act(() => {
            store.set({ a: 1, b: 999, nested: { x: 10 } });
        });

        expect(result.current).toBe(1);

        act(() => {
            store.set({ a: 7, b: 999, nested: { x: 10 } });
        });

        expect(result.current).toBe(7);
    });

    it("uses shallowEqual for object selections by default", () => {
        const store = createTestStore({ a: 1, b: 2 });

        const selector = (s) => ({ a: s.a });
        const { result } = renderHook(() => use(store, selector));

        const first = result.current;
        expect(first).toEqual({ a: 1 });

        act(() => {
            store.set({ a: 1, b: 999 });
        });

        expect(result.current).toBe(first);

        act(() => {
            store.set({ a: 2, b: 999 });
        });

        expect(result.current).toEqual({ a: 2 });
        expect(result.current).not.toBe(first);
    });

    it("uses custom equalityFn when provided", () => {
        const store = createTestStore({ a: 1, b: 2 });

        const equalityFn = vi.fn((prev, next) => {
            return prev?.a === next?.a;
        });

        const selector = (s) => ({ a: s.a, noisy: s.b });
        const { result } = renderHook(() => use(store, selector, equalityFn));

        const first = result.current;
        expect(first).toEqual({ a: 1, noisy: 2 });

        act(() => {
            store.set({ a: 1, b: 999 });
        });

        expect(equalityFn).toHaveBeenCalled();
        expect(result.current).toBe(first);

        act(() => {
            store.set({ a: 2, b: 999 });
        });

        expect(result.current).toEqual({ a: 2, noisy: 999 });
        expect(result.current).not.toBe(first);
    });

    it("supports array selections with shallowEqual semantics", () => {
        const store = createTestStore({ x: 1, y: 2, z: 3 });

        const selector = (s) => [s.x, s.y];
        const { result } = renderHook(() => use(store, selector));

        const first = result.current;
        expect(first).toEqual([1, 2]);

        act(() => {
            store.set({ x: 1, y: 2, z: 999 });
        });

        expect(result.current).toBe(first);

        act(() => {
            store.set({ x: 1, y: 9, z: 999 });
        });

        expect(result.current).toEqual([1, 9]);
        expect(result.current).not.toBe(first);
    });
});

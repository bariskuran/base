import { describe, it, expect, vi } from "vitest";
import { create } from "./index.js";

describe("baseStore.create", () => {
    it("creates a store with id/get/set/subscribe/getVersion", () => {
        const store = create({ a: 1 });

        expect(typeof store.id).toBe("string");
        expect(typeof store.get).toBe("function");
        expect(typeof store.set).toBe("function");
        expect(typeof store.subscribe).toBe("function");
        expect(typeof store.getVersion).toBe("function");

        expect(store.get()).toEqual({ a: 1 });
        expect(store.getVersion()).toBe(0);
    });

    it("set(object) shallow merges into previous state", () => {
        const store = create({ a: 1, b: 2 });

        store.set({ b: 3, c: 4 });

        expect(store.get()).toEqual({ a: 1, b: 3, c: 4 });
        expect(store.getVersion()).toBe(1);
    });

    it("set(primitive) replaces state", () => {
        const store = create({ a: 1 });

        store.set(10);

        expect(store.get()).toBe(10);
        expect(store.getVersion()).toBe(1);
    });

    it("does not update version when set does not change state", () => {
        const store = create({ a: 1 });

        store.set({ a: 1 });

        expect(store.get()).toEqual({ a: 1 });
        expect(store.getVersion()).toBe(0);
    });

    it("supports recipe updates (draft mutation) with deep paths", () => {
        const store = create({ test: 1, A: {} });

        store.set((d) => {
            d.test = d.test + 1;
            d.A.B.C = 1;
        });

        expect(store.get()).toEqual({ test: 2, A: { B: { C: 1 } } });
        expect(store.getVersion()).toBe(1);
    });

    it("supports incrementing a missing deep numeric value without type checks", () => {
        const store = create({ A: { D: {} } });

        store.set((d) => {
            d.A.D.E = d.A.D.E + 1;
        });

        store.set((d) => {
            d.A.D.E = d.A.D.E + 2;
        });

        expect(store.get()).toEqual({ A: { D: { E: 3 } } });
        expect(store.getVersion()).toBe(2);
    });

    it("supports delete inside recipe and triggers change only when key exists", () => {
        const store = create({ A: { B: { C: 1 }, D: { E: 3 } } });

        store.set((d) => {
            delete d.A.B;
        });

        expect(store.get()).toEqual({ A: { D: { E: 3 } } });
        expect(store.getVersion()).toBe(1);

        store.set((d) => {
            delete d.A.B;
        });

        expect(store.getVersion()).toBe(1);
    });

    it("subscribe notifies listeners with (next, prev) and unsubscribe stops notifications", () => {
        const store = create({ count: 0 });
        const listener = vi.fn();

        const unsubscribe = store.subscribe(listener);

        store.set({ count: 1 });
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ count: 1 }, { count: 0 });

        unsubscribe();

        store.set({ count: 2 });
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("does not notify listeners when recipe makes no changes", () => {
        const store = create({ a: 1 });
        const listener = vi.fn();
        store.subscribe(listener);

        store.set((d) => {
            const x = d.a;
            void x;
        });

        expect(store.getVersion()).toBe(0);
        expect(listener).toHaveBeenCalledTimes(0);
    });

    it("throws when trying to create deep path through a non-container value", () => {
        const store = create({ A: { B: 123 } });

        expect(() => {
            store.set((d) => {
                d.A.B.C = 1;
            });
        }).toThrow();
    });
});

import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// IMPORTANT: Adjust import path if your test layout differs
import { useImmer } from "./index";

describe("useImmer", () => {
    it("initializes with a direct value and returns [state, setState]", () => {
        const { result } = renderHook(() => useImmer({ count: 0 }));

        expect(result.current[0]).toEqual({ count: 0 });
        expect(typeof result.current[1]).toBe("function");
    });

    it("supports lazy initializer function (called once)", () => {
        const init = vi.fn(() => ({ count: 1 }));

        const { result, rerender } = renderHook(() => useImmer(init));

        expect(init).toHaveBeenCalledTimes(1);
        expect(result.current[0]).toEqual({ count: 1 });

        rerender();
        expect(init).toHaveBeenCalledTimes(1);
    });

    it("updates via Immer recipe (draft mutation)", () => {
        const { result } = renderHook(() => useImmer({ count: 0, nested: { a: 1 } }));

        act(() => {
            result.current[1]((draft) => {
                draft.count += 1;
                draft.nested.a = 2;
            });
        });

        expect(result.current[0]).toEqual({ count: 1, nested: { a: 2 } });
    });

    it("replaces state directly when updater is a non-function value", () => {
        const { result } = renderHook(() => useImmer({ count: 0 }));

        act(() => {
            result.current[1]({ count: 10 });
        });

        expect(result.current[0]).toEqual({ count: 10 });
    });

    it("freezes state deeply (prevents accidental mutations)", () => {
        const { result } = renderHook(() => useImmer({ nested: { a: 1 } }));

        // deep freeze
        expect(Object.isFrozen(result.current[0])).toBe(true);
        expect(Object.isFrozen(result.current[0].nested)).toBe(true);

        // mutation should throw in strict-mode environments (ESM runs in strict mode)
        expect(() => {
            // @ts-ignore
            result.current[0].nested.a = 999;
        }).toThrow();
    });

    it("keeps setter reference stable across rerenders", () => {
        const { result, rerender } = renderHook(() => useImmer({ count: 0 }));

        const set1 = result.current[1];
        rerender();
        const set2 = result.current[1];

        expect(set1).toBe(set2);
    });

    it("Immer recipe preserves structural sharing for untouched branches", () => {
        const { result } = renderHook(() =>
            useImmer({
                a: { x: 1 },
                b: { y: 2 },
            }),
        );

        const prev = result.current[0];
        const prevA = prev.a;
        const prevB = prev.b;

        act(() => {
            result.current[1]((draft) => {
                draft.a.x = 123; // touch only a
            });
        });

        const next = result.current[0];
        expect(next.a).not.toBe(prevA);
        expect(next.b).toBe(prevB); // b should be shared
    });
});

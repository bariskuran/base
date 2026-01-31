import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

const debouncedFunctionSpy = vi.fn(() => vi.fn());

vi.mock("../debouncedFunction", () => ({
    debouncedFunction: (...args) => debouncedFunctionSpy(...args),
}));

import { useDebouncedFunction } from "./index";
import { debouncedFunction } from "../debouncedFunction";

describe("useDebouncedFunction", () => {
    beforeEach(() => {
        debouncedFunctionSpy.mockClear();
        debouncedFunction.mockClear?.();
    });

    it("calls debouncedFunction with (fn, settings) on mount", () => {
        const fn = vi.fn();
        const settings = { delay: 250, getFirst: true };

        renderHook(() => useDebouncedFunction(fn, settings));

        expect(debouncedFunctionSpy).toHaveBeenCalledTimes(1);
        expect(debouncedFunctionSpy).toHaveBeenCalledWith(fn, settings);
    });

    it("returns the debounced function created by debouncedFunction", () => {
        const fn = vi.fn();
        const settings = { delay: 300 };

        const debounced = vi.fn();
        debouncedFunctionSpy.mockReturnValueOnce(debounced);

        const { result } = renderHook(() => useDebouncedFunction(fn, settings));

        expect(result.current).toBe(debounced);
    });

    it("memoizes the result when fn and settings refs are stable", () => {
        const fn = vi.fn();
        const settings = { delay: 400 };

        const { result, rerender } = renderHook(({ f, s }) => useDebouncedFunction(f, s), {
            initialProps: { f: fn, s: settings },
        });

        const first = result.current;
        rerender({ f: fn, s: settings });
        expect(result.current).toBe(first);

        expect(debouncedFunctionSpy).toHaveBeenCalledTimes(1);
    });

    it("recreates when fn reference changes", () => {
        const settings = { delay: 500 };

        const fn1 = vi.fn();
        const fn2 = vi.fn();

        const deb1 = vi.fn();
        const deb2 = vi.fn();

        debouncedFunctionSpy.mockReturnValueOnce(deb1).mockReturnValueOnce(deb2);

        const { result, rerender } = renderHook(({ f }) => useDebouncedFunction(f, settings), {
            initialProps: { f: fn1 },
        });

        expect(result.current).toBe(deb1);

        rerender({ f: fn2 });

        expect(result.current).toBe(deb2);
        expect(debouncedFunctionSpy).toHaveBeenCalledTimes(2);
    });

    it("recreates when settings reference changes (even if deep-equal)", () => {
        const fn = vi.fn();

        const s1 = { delay: 600 };
        const s2 = { delay: 600 };

        const deb1 = vi.fn();
        const deb2 = vi.fn();

        debouncedFunctionSpy.mockReturnValueOnce(deb1).mockReturnValueOnce(deb2);

        const { result, rerender } = renderHook(({ s }) => useDebouncedFunction(fn, s), {
            initialProps: { s: s1 },
        });

        expect(result.current).toBe(deb1);

        rerender({ s: s2 });

        expect(result.current).toBe(deb2);
        expect(debouncedFunctionSpy).toHaveBeenCalledTimes(2);
    });
});

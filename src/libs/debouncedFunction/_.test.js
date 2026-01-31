import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../generateRandomText", () => ({
    generateRandomText: vi.fn(() => "FIXED_NAME"),
}));

import { debouncedFunction } from "./index";
import { generateRandomText } from "../generateRandomText";

describe("debouncedFunction", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns the original function when delay is missing or < 100", () => {
        const fn = vi.fn();

        const a = debouncedFunction(fn, { delay: 0 });
        const b = debouncedFunction(fn, { delay: 50 });
        const c = debouncedFunction(fn, { delay: null });

        expect(a).toBe(fn);
        expect(b).toBe(fn);
        expect(c).toBe(fn);
    });

    it("generates a default functionName when not provided", () => {
        const fn = vi.fn();

        const d = debouncedFunction(fn, { delay: 200 });
        d(1);

        expect(generateRandomText).toHaveBeenCalledTimes(1);
        expect(generateRandomText).toHaveBeenCalledWith(16);
    });

    it("debounces calls and runs once with the last arguments", () => {
        const fn = vi.fn();
        const d = debouncedFunction(fn, { delay: 200, functionName: "A" });

        d(1);
        d(2);
        d(3);

        expect(fn).toHaveBeenCalledTimes(0);

        vi.advanceTimersByTime(199);
        expect(fn).toHaveBeenCalledTimes(0);

        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(3);
    });

    it("debounce + getFirst runs immediately on first call and does not run again if no other calls happen", () => {
        const fn = vi.fn();
        const d = debouncedFunction(fn, { delay: 200, getFirst: true, functionName: "B" });

        d("x");

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith("x");

        vi.advanceTimersByTime(200);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("debounce + getFirst runs immediately, and if called again during the window it runs once more with last args", () => {
        const fn = vi.fn();
        const d = debouncedFunction(fn, { delay: 200, getFirst: true, functionName: "C" });

        d(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(1);

        vi.advanceTimersByTime(50);
        d(2);
        d(3);

        expect(fn).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(200);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith(3);
    });

    it("throttle (isThrottle=true) runs once immediately when getFirst=true and once at the end if called during wait", () => {
        const fn = vi.fn();
        const t = debouncedFunction(fn, {
            delay: 200,
            isThrottle: true,
            getFirst: true,
            functionName: "T1",
        });

        t("a");
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenLastCalledWith("a");

        vi.advanceTimersByTime(50);
        t("b");
        t("c");

        expect(fn).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(200);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith("c");
    });

    it("throttle (isThrottle=true) runs only at the end when getFirst=false", () => {
        const fn = vi.fn();
        const t = debouncedFunction(fn, {
            delay: 200,
            isThrottle: true,
            getFirst: false,
            functionName: "T2",
        });

        t(1);
        expect(fn).toHaveBeenCalledTimes(0);

        vi.advanceTimersByTime(50);
        t(2);
        t(3);

        vi.advanceTimersByTime(200);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(3);
    });

    it("uses functionName to share state between wrappers (same key)", () => {
        const fn1 = vi.fn();
        const fn2 = vi.fn();

        const a = debouncedFunction(fn1, { delay: 200, functionName: "SHARED" });
        const b = debouncedFunction(fn2, { delay: 200, functionName: "SHARED" });

        a("x");
        b("y");

        vi.advanceTimersByTime(200);

        expect(fn1).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledWith("y");
    });
});

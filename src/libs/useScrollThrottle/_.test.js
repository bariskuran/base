import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollThrottle } from "./index";

describe("useScrollThrottle", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("adds and removes scroll listener", () => {
        const addSpy = vi.spyOn(window, "addEventListener");
        const removeSpy = vi.spyOn(window, "removeEventListener");

        const cb = vi.fn();
        const { unmount } = renderHook(() => useScrollThrottle(cb, 100));

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(addSpy.mock.calls[0][0]).toBe("scroll");
        expect(typeof addSpy.mock.calls[0][1]).toBe("function");
        expect(addSpy.mock.calls[0][2]).toEqual(expect.objectContaining({ passive: true }));

        unmount();

        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(removeSpy.mock.calls[0][0]).toBe("scroll");
        expect(typeof removeSpy.mock.calls[0][1]).toBe("function");
    });

    it("throttles callback by delay", () => {
        let handler;
        vi.spyOn(window, "addEventListener").mockImplementation((type, fn) => {
            if (type === "scroll") handler = fn;
        });
        vi.spyOn(window, "removeEventListener").mockImplementation(() => {});

        const cb = vi.fn();
        renderHook(() => useScrollThrottle(cb, 100));

        expect(typeof handler).toBe("function");

        handler();
        expect(cb).toHaveBeenCalledTimes(1);

        vi.setSystemTime(new Date("2020-01-01T00:00:00.050Z"));
        handler();
        handler();
        expect(cb).toHaveBeenCalledTimes(1);

        vi.setSystemTime(new Date("2020-01-01T00:00:00.100Z"));
        handler();
        expect(cb).toHaveBeenCalledTimes(2);

        vi.setSystemTime(new Date("2020-01-01T00:00:00.199Z"));
        handler();
        expect(cb).toHaveBeenCalledTimes(2);

        vi.setSystemTime(new Date("2020-01-01T00:00:00.200Z"));
        handler();
        expect(cb).toHaveBeenCalledTimes(3);
    });

    it("uses latest callback after rerender", () => {
        let handler;
        vi.spyOn(window, "addEventListener").mockImplementation((type, fn) => {
            if (type === "scroll") handler = fn;
        });
        vi.spyOn(window, "removeEventListener").mockImplementation(() => {});

        const cb1 = vi.fn();
        const cb2 = vi.fn();

        const { rerender } = renderHook(({ cb }) => useScrollThrottle(cb, 100), {
            initialProps: { cb: cb1 },
        });

        handler();
        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(0);

        rerender({ cb: cb2 });

        vi.setSystemTime(new Date("2020-01-01T00:00:00.100Z"));
        handler();
        expect(cb1).toHaveBeenCalledTimes(1);
        expect(cb2).toHaveBeenCalledTimes(1);
    });
});

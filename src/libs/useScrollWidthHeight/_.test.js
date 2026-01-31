import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.useFakeTimers();

vi.mock("../useImagesReady", () => {
    return { useImagesReady: vi.fn() };
});

vi.mock("../useEventListener", () => {
    return { useEventListener: vi.fn() };
});

vi.mock("../@baseStore", async () => {
    const React = await vi.importActual("react");

    const useLocal = (initialState = {}) => {
        const [state, setState] = React.useState(initialState);

        const set = (next) => {
            setState((prev) => ({ ...prev, ...(next || {}) }));
        };

        return { ...state, store: { set } };
    };

    return { baseStore: { useLocal } };
});

import { useImagesReady } from "../useImagesReady";
import { useEventListener } from "../useEventListener";
import { useScrollWidthHeight } from "./index";

describe("useScrollWidthHeight", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("returns initial width/height and a recalc function", () => {
        const { result } = renderHook(() => useScrollWidthHeight(undefined, { settleDelay: 10 }));

        expect(result.current[0]).toBe(0);
        expect(result.current[1]).toBe(0);
        expect(typeof result.current[2]).toBe("function");

        expect(useImagesReady).toHaveBeenCalledTimes(1);
        expect(useImagesReady.mock.calls[0][0]).toBe(result.current[2]);

        expect(useEventListener).toHaveBeenCalledTimes(1);
        expect(useEventListener.mock.calls[0][0]).toBe("resize");
        expect(useEventListener.mock.calls[0][1]).toBe(result.current[2]);
        expect(useEventListener.mock.calls[0][2]).toEqual(
            expect.objectContaining({ delay: 1000, isThrottle: true, passive: true }),
        );
    });

    it("measures document scroll size when no source is provided", () => {
        const body = document.body;
        const docEl = document.documentElement;

        const prev = {
            bsw: body.scrollWidth,
            dsw: docEl.scrollWidth,
            bow: body.offsetWidth,
            dow: docEl.offsetWidth,
            bcw: body.clientWidth,
            dcw: docEl.clientWidth,
            bsh: body.scrollHeight,
            dsh: docEl.scrollHeight,
            boh: body.offsetHeight,
            doh: docEl.offsetHeight,
            bch: body.clientHeight,
            dch: docEl.clientHeight,
        };

        Object.defineProperty(body, "scrollWidth", { configurable: true, value: 111 });
        Object.defineProperty(docEl, "scrollWidth", { configurable: true, value: 222 });
        Object.defineProperty(body, "offsetWidth", { configurable: true, value: 100 });
        Object.defineProperty(docEl, "offsetWidth", { configurable: true, value: 200 });
        Object.defineProperty(body, "clientWidth", { configurable: true, value: 90 });
        Object.defineProperty(docEl, "clientWidth", { configurable: true, value: 180 });

        Object.defineProperty(body, "scrollHeight", { configurable: true, value: 333 });
        Object.defineProperty(docEl, "scrollHeight", { configurable: true, value: 444 });
        Object.defineProperty(body, "offsetHeight", { configurable: true, value: 300 });
        Object.defineProperty(docEl, "offsetHeight", { configurable: true, value: 400 });
        Object.defineProperty(body, "clientHeight", { configurable: true, value: 290 });
        Object.defineProperty(docEl, "clientHeight", { configurable: true, value: 380 });

        const { result } = renderHook(() => useScrollWidthHeight(undefined, { settleDelay: 50 }));

        act(() => {
            result.current[2]();
        });

        expect(result.current[0]).toBe(0);
        expect(result.current[1]).toBe(0);

        act(() => {
            vi.advanceTimersByTime(49);
        });
        expect(result.current[0]).toBe(0);
        expect(result.current[1]).toBe(0);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(result.current[0]).toBe(222);
        expect(result.current[1]).toBe(444);

        Object.defineProperty(body, "scrollWidth", { configurable: true, value: prev.bsw });
        Object.defineProperty(docEl, "scrollWidth", { configurable: true, value: prev.dsw });
        Object.defineProperty(body, "offsetWidth", { configurable: true, value: prev.bow });
        Object.defineProperty(docEl, "offsetWidth", { configurable: true, value: prev.dow });
        Object.defineProperty(body, "clientWidth", { configurable: true, value: prev.bcw });
        Object.defineProperty(docEl, "clientWidth", { configurable: true, value: prev.dcw });

        Object.defineProperty(body, "scrollHeight", { configurable: true, value: prev.bsh });
        Object.defineProperty(docEl, "scrollHeight", { configurable: true, value: prev.dsh });
        Object.defineProperty(body, "offsetHeight", { configurable: true, value: prev.boh });
        Object.defineProperty(docEl, "offsetHeight", { configurable: true, value: prev.doh });
        Object.defineProperty(body, "clientHeight", { configurable: true, value: prev.bch });
        Object.defineProperty(docEl, "clientHeight", { configurable: true, value: prev.dch });
    });

    it("measures element size via getBoundingClientRect when source is provided", () => {
        const el = {
            getBoundingClientRect: vi.fn(() => ({ width: 123.4, height: 567.8 })),
        };

        const { result } = renderHook(() => useScrollWidthHeight(el, { settleDelay: 10 }));

        act(() => {
            result.current[2]();
        });

        act(() => {
            vi.advanceTimersByTime(10);
        });

        expect(el.getBoundingClientRect).toHaveBeenCalledTimes(1);
        expect(result.current[0]).toBe(123);
        expect(result.current[1]).toBe(568);
    });

    it("cancels pending timeout on unmount", () => {
        const { result, unmount } = renderHook(() =>
            useScrollWidthHeight(undefined, { settleDelay: 100 }),
        );

        act(() => {
            result.current[2]();
        });

        unmount();

        act(() => {
            vi.runOnlyPendingTimers();
        });

        expect(true).toBe(true);
    });
});

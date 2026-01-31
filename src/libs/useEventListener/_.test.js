import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventListener } from "./index";

const createMockTarget = () => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
});

describe("useEventListener", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("adds a listener to source and removes it on unmount", () => {
        const handler = vi.fn();
        const target = createMockTarget();

        const { unmount } = renderHook(() =>
            useEventListener("scroll", handler, { enabled: true, delay: 0, source: target }),
        );

        expect(target.addEventListener).toHaveBeenCalledTimes(1);

        const [ev, listener, options] = target.addEventListener.mock.calls[0];
        expect(ev).toBe("scroll");
        expect(typeof listener).toBe("function");
        expect(options).toEqual({});

        unmount();

        expect(target.removeEventListener).toHaveBeenCalledTimes(1);
        const [rev, rlistener, rcapture] = target.removeEventListener.mock.calls[0];
        expect(rev).toBe("scroll");
        expect(rlistener).toBe(listener);
        expect(rcapture).toBeUndefined();
    });

    it("does not add listeners when enabled is false", () => {
        const handler = vi.fn();
        const target = createMockTarget();

        renderHook(() =>
            useEventListener("scroll", handler, { enabled: false, delay: 0, source: target }),
        );

        expect(target.addEventListener).not.toHaveBeenCalled();
        expect(target.removeEventListener).not.toHaveBeenCalled();
    });

    it("supports multiple events", () => {
        const handler = vi.fn();
        const target = createMockTarget();

        const { unmount } = renderHook(() =>
            useEventListener(["scroll", "resize"], handler, {
                enabled: true,
                delay: 0,
                source: target,
            }),
        );

        expect(target.addEventListener).toHaveBeenCalledTimes(2);
        expect(target.addEventListener.mock.calls.map((c) => c[0])).toEqual(["scroll", "resize"]);

        const listener1 = target.addEventListener.mock.calls[0][1];
        const listener2 = target.addEventListener.mock.calls[1][1];

        unmount();

        expect(target.removeEventListener).toHaveBeenCalledTimes(2);
        expect(target.removeEventListener.mock.calls.map((c) => c[0])).toEqual([
            "scroll",
            "resize",
        ]);
        expect(target.removeEventListener.mock.calls[0][1]).toBe(listener1);
        expect(target.removeEventListener.mock.calls[1][1]).toBe(listener2);
    });

    it("passes options (capture/once/passive) to addEventListener", () => {
        const handler = vi.fn();
        const target = createMockTarget();

        const { unmount } = renderHook(() =>
            useEventListener("click", handler, {
                enabled: true,
                delay: 0,
                source: target,
                capture: true,
                once: true,
                passive: true,
            }),
        );

        expect(target.addEventListener).toHaveBeenCalledTimes(1);

        const options = target.addEventListener.mock.calls[0][2];
        expect(options).toEqual({
            capture: true,
            once: true,
            passive: true,
        });

        unmount();

        expect(target.removeEventListener).toHaveBeenCalledTimes(1);
        const rcapture = target.removeEventListener.mock.calls[0][2];
        expect(rcapture).toBe(true);
    });

    it("calls handler immediately when delay is 0", () => {
        const handler = vi.fn();
        const target = createMockTarget();

        renderHook(() =>
            useEventListener("click", handler, { enabled: true, delay: 0, source: target }),
        );

        const listener = target.addEventListener.mock.calls[0][1];
        const ev = new Event("click");
        listener(ev);

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(ev);
    });

    it("uses the latest handler after rerender", async () => {
        const handler1 = vi.fn();
        const handler2 = vi.fn();
        const target = createMockTarget();

        const { rerender } = renderHook(
            ({ handler }) =>
                useEventListener("click", handler, { enabled: true, delay: 0, source: target }),
            { initialProps: { handler: handler1 } },
        );

        const listener = target.addEventListener.mock.calls[0][1];

        const ev1 = new Event("click");
        listener(ev1);
        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(0);

        await act(() => {
            rerender({ handler: handler2 });
        });

        const ev2 = new Event("click");
        listener(ev2);
        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
    });
});

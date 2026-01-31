import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.useFakeTimers();

vi.mock("../@baseStore", async () => {
    const React = await vi.importActual("react");

    const useLocal = (initialState = {}) => {
        const [state, setState] = React.useState(initialState);

        const setLocal = (patch) => {
            setState((prev) => {
                const next = typeof patch === "function" ? patch(prev) : patch;
                return { ...prev, ...(next || {}) };
            });
        };

        return { ...state, setLocal };
    };

    return { baseStore: { useLocal } };
});

import { useTimer } from "./index";

describe("useTimer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("returns initial state", () => {
        const { result } = renderHook(() => useTimer({ onEnd: vi.fn() }));
        expect(result.current.isRunning).toBe(false);
        expect(typeof result.current.start).toBe("function");
        expect(typeof result.current.stop).toBe("function");
    });

    it("does not start if onEnd is missing", () => {
        const onStart = vi.fn();
        const { result } = renderHook(() => useTimer({ onStart }));

        act(() => {
            result.current.start();
        });

        expect(onStart).toHaveBeenCalledTimes(0);
        expect(result.current.isRunning).toBe(false);

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(result.current.isRunning).toBe(false);
    });

    it("start calls onStart immediately, then onEnd after refreshTime, and stops when loop=false", () => {
        const onStart = vi.fn();
        const onEnd = vi.fn();

        const { result } = renderHook(() =>
            useTimer({ onStart, onEnd, refreshTime: 200, loop: false }),
        );

        act(() => {
            result.current.start();
        });

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(onEnd).toHaveBeenCalledTimes(0);
        expect(result.current.isRunning).toBe(true);

        act(() => {
            vi.advanceTimersByTime(199);
        });

        expect(onEnd).toHaveBeenCalledTimes(0);
        expect(result.current.isRunning).toBe(true);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(result.current.isRunning).toBe(false);
    });

    it("loop=true restarts automatically and keeps isRunning true", () => {
        const onStart = vi.fn();
        const onEnd = vi.fn();

        const { result, unmount } = renderHook(() =>
            useTimer({ onStart, onEnd, refreshTime: 100, loop: true }),
        );

        act(() => {
            result.current.start();
        });

        expect(result.current.isRunning).toBe(true);
        expect(onStart).toHaveBeenCalledTimes(1);

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(result.current.isRunning).toBe(true);

        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(onEnd).toHaveBeenCalledTimes(2);
        expect(result.current.isRunning).toBe(true);

        act(() => {
            result.current.stop();
        });
        expect(result.current.isRunning).toBe(false);

        unmount();
    });

    it("stop cancels pending timeout", () => {
        const onEnd = vi.fn();

        const { result } = renderHook(() => useTimer({ onEnd, refreshTime: 300, loop: false }));

        act(() => {
            result.current.start();
        });
        expect(result.current.isRunning).toBe(true);

        act(() => {
            result.current.stop();
        });
        expect(result.current.isRunning).toBe(false);

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(onEnd).toHaveBeenCalledTimes(0);
        expect(result.current.isRunning).toBe(false);
    });

    it("supports overrides (refreshTime/loop) in start()", () => {
        const onEnd = vi.fn();

        const { result } = renderHook(() => useTimer({ onEnd, refreshTime: 999, loop: true }));

        act(() => {
            result.current.start({ refreshTime: 50, loop: false });
        });

        expect(result.current.isRunning).toBe(true);

        act(() => {
            vi.advanceTimersByTime(50);
        });

        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(result.current.isRunning).toBe(false);
    });

    it("startOnLoad starts automatically on mount", () => {
        const onStart = vi.fn();
        const onEnd = vi.fn();

        const { result } = renderHook(() =>
            useTimer({ onStart, onEnd, refreshTime: 100, loop: false, startOnLoad: true }),
        );

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(result.current.isRunning).toBe(true);

        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(result.current.isRunning).toBe(false);
    });
});

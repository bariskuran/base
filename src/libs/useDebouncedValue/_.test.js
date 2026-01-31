import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

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

import { useDebouncedValue } from "./index";

describe("useDebouncedValue", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(async () => {
        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        vi.useRealTimers();
    });

    it("returns initial values", () => {
        const { result } = renderHook(() => useDebouncedValue("A", { delay: 100 }));

        expect(result.current[0]).toBe("A");

        const api = result.current[2];
        expect(api.value).toBe("A");
        expect(api.isWaiting).toBe(false);
        expect(typeof result.current[1]).toBe("function");
        expect(typeof api.setDebouncedValue).toBe("function");
        expect(typeof api.reset).toBe("function");
    });

    it("debounces: updates debouncedValue after delay", async () => {
        const { result } = renderHook(() => useDebouncedValue("A", { delay: 200, enabled: true }));

        act(() => {
            result.current[1]("B");
        });

        expect(result.current[2].value).toBe("B");
        expect(result.current[0]).toBe("A");

        await act(async () => {
            await vi.advanceTimersByTimeAsync(199);
        });
        expect(result.current[0]).toBe("A");

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1);
        });
        expect(result.current[0]).toBe("B");
    });

    it("debounces: cancels previous timer when value changes again", async () => {
        const { result } = renderHook(() => useDebouncedValue("A", { delay: 300, enabled: true }));

        act(() => {
            result.current[1]("B");
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(200);
        });

        act(() => {
            result.current[1]("C");
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(299);
        });
        expect(result.current[0]).toBe("A");

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1);
        });
        expect(result.current[0]).toBe("C");
    });

    it("setDebouncedValue sets debouncedValue immediately", () => {
        const { result } = renderHook(() => useDebouncedValue("A", { delay: 500, enabled: true }));

        act(() => {
            result.current[2].setDebouncedValue("X");
        });

        expect(result.current[0]).toBe("X");
        expect(result.current[2].value).toBe("A");
    });

    it("reset resets value and debouncedValue to initial value when no arg is provided", async () => {
        const { result } = renderHook(() => useDebouncedValue("A", { delay: 200, enabled: true }));

        act(() => {
            result.current[1]("B");
        });

        act(() => {
            result.current[2].reset();
        });

        expect(result.current[2].value).toBe("A");
        expect(result.current[0]).toBe("A");
        expect(result.current[2].isWaiting).toBe(false);

        // IMPORTANT: kill any pending debounce timer created by the earlier setValue("B")
        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(result.current[2].value).toBe("A");
        expect(result.current[0]).toBe("A");
    });

    it("reset resets value and debouncedValue to provided value", async () => {
        const { result } = renderHook(() => useDebouncedValue("A", { delay: 200, enabled: true }));

        act(() => {
            result.current[2].reset("Z");
        });

        expect(result.current[2].value).toBe("Z");
        expect(result.current[0]).toBe("Z");
        expect(result.current[2].isWaiting).toBe(false);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
    });
});

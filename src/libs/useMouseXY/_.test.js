import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// 1) useEventListener'ı mocklayacağız (hook içinde nasıl çağrıldığını yakalamak için)
vi.mock("../useEventListener", () => ({
    useEventListener: vi.fn(),
}));

// 2) baseStore.useLocal'ı React state ile taklit edeceğiz
vi.mock("../@baseStore", async () => {
    const React = await vi.importActual("react");

    const useLocal = (initialState = {}) => {
        const init = {
            x: 0,
            y: 0,
            ...(initialState || {}),
        };

        const [state, setState] = React.useState(init);

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

import { useEventListener } from "../useEventListener";
import { useMouseXY } from "./index";

describe("useMouseXY", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("registers a throttled mousemove listener with correct settings", () => {
        renderHook(() => useMouseXY(123));

        expect(useEventListener).toHaveBeenCalledTimes(1);

        const [evName, handler, settings] = useEventListener.mock.calls[0];

        expect(evName).toBe("mousemove");
        expect(typeof handler).toBe("function");

        expect(settings).toEqual(
            expect.objectContaining({
                delay: 123,
                isThrottle: true,
                passive: true,
            }),
        );
    });

    it("updates [x,y] when the mousemove handler fires", () => {
        const { result } = renderHook(() => useMouseXY(50));

        // initial
        expect(result.current).toEqual([0, 0]);

        // mock'tan handler'ı alalım ve manuel tetikleyelim
        const handler = useEventListener.mock.calls[0][1];

        act(() => {
            handler({ clientX: 10, clientY: 20 });
        });

        expect(result.current).toEqual([10, 20]);
    });

    it("uses the provided delay and updates it on rerender", () => {
        const { rerender } = renderHook(({ delay }) => useMouseXY(delay), {
            initialProps: { delay: 100 },
        });

        expect(useEventListener).toHaveBeenCalledTimes(1);
        expect(useEventListener.mock.calls[0][2]).toEqual(expect.objectContaining({ delay: 100 }));

        rerender({ delay: 250 });

        // hook tekrar çalışır, listener tekrar register edilir
        expect(useEventListener).toHaveBeenCalledTimes(2);
        expect(useEventListener.mock.calls[1][2]).toEqual(expect.objectContaining({ delay: 250 }));
    });
});

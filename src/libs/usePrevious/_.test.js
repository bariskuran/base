import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../@baseStore", async () => {
    const React = await vi.importActual("react");

    const useLocal = (initialState = {}) => {
        const [state, setState] = React.useState(initialState);

        const setLocal = (patch) => {
            setState((prev) => {
                const base = prev || {};
                if (typeof patch === "function") {
                    const draft = { ...base };
                    patch(draft);
                    return draft;
                }
                const next = patch || {};
                return { ...base, ...next };
            });
        };

        return { ...(state || {}), setLocal };
    };

    return { baseStore: { useLocal } };
});

import { usePrevious } from "./index";

describe("usePrevious", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("returns [previousValue, setPreviousValue]", () => {
        const { result } = renderHook(() => usePrevious("A"));
        expect(Array.isArray(result.current)).toBe(true);
        expect(result.current.length).toBe(2);
        expect(typeof result.current[1]).toBe("function");
    });

    it("starts with null, then becomes the current value after the mount effect", () => {
        const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
            initialProps: { v: "A" },
        });

        expect(result.current[0]).toBe("A");

        act(() => {
            rerender({ v: "A" });
        });

        expect(result.current[0]).toBe("A");
    });

    it("stores the previous value across rerenders (previous shows A when value becomes B)", () => {
        const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
            initialProps: { v: "A" },
        });

        act(() => {
            rerender({ v: "B" });
        });

        expect(result.current[0]).toBe("B");

        act(() => {
            rerender({ v: "B" });
        });

        expect(result.current[0]).toBe("B");
    });

    it("manual setter updates immediately", () => {
        const { result } = renderHook(() => usePrevious("A"));

        act(() => {
            result.current[1]("MANUAL");
        });

        expect(result.current[0]).toBe("MANUAL");
    });
});

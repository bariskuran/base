import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEffectAfterMount } from "./index";

describe("useEffectAfterMount", () => {
    it("does not run on initial render", () => {
        const cb = vi.fn();

        renderHook(({ dep }) => useEffectAfterMount(cb, [dep]), {
            initialProps: { dep: 0 },
        });

        expect(cb).not.toHaveBeenCalled();
    });

    it("runs after mount when dependencies change", () => {
        const cb = vi.fn();

        const { rerender } = renderHook(({ dep }) => useEffectAfterMount(cb, [dep]), {
            initialProps: { dep: 0 },
        });

        expect(cb).not.toHaveBeenCalled();

        rerender({ dep: 1 });
        expect(cb).toHaveBeenCalledTimes(1);

        rerender({ dep: 2 });
        expect(cb).toHaveBeenCalledTimes(2);
    });

    it("uses the latest callback when dependencies change", () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        const { rerender } = renderHook(({ dep, cb }) => useEffectAfterMount(cb, [dep]), {
            initialProps: { dep: 0, cb: cb1 },
        });

        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).not.toHaveBeenCalled();

        rerender({ dep: 0, cb: cb2 });
        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).not.toHaveBeenCalled();

        rerender({ dep: 1, cb: cb2 });
        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).toHaveBeenCalledTimes(1);
    });

    it("does not run when dependencies do not change", () => {
        const cb = vi.fn();

        const { rerender } = renderHook(({ dep }) => useEffectAfterMount(cb, [dep]), {
            initialProps: { dep: 1 },
        });

        rerender({ dep: 1 });
        expect(cb).not.toHaveBeenCalled();
    });
});

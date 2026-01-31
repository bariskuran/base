import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

const createMock = vi.fn();
const useMock = vi.fn();

vi.mock("../create", () => ({
    create: (...args) => createMock(...args),
}));

vi.mock("../use", () => ({
    use: (...args) => useMock(...args),
}));

import { useLocal } from "./index";

describe("useLocal", () => {
    beforeEach(() => {
        createMock.mockReset();
        useMock.mockReset();
    });

    it("creates a store only once and uses it", () => {
        const store = { set: vi.fn(), get: vi.fn(), subscribe: vi.fn() };
        createMock.mockReturnValue(store);

        useMock.mockReturnValue({ a: 1 });

        const { rerender } = renderHook(() => useLocal({ x: 0 }));

        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledWith({ x: 0 });

        expect(useMock).toHaveBeenCalledTimes(1);
        expect(useMock).toHaveBeenCalledWith(store);

        rerender();

        expect(createMock).toHaveBeenCalledTimes(1);
    });

    it("returns spread of use(store) plus setLocal bound to store.set", () => {
        const set = vi.fn();
        const store = { set, get: vi.fn(), subscribe: vi.fn() };
        createMock.mockReturnValue(store);

        useMock.mockReturnValue({ inViewport: false, node: null });

        const { result } = renderHook(() => useLocal({ inViewport: true }));

        expect(result.current).toEqual(
            expect.objectContaining({
                inViewport: false,
                node: null,
                setLocal: set,
            }),
        );
        expect(result.current.setLocal).toBe(set);
    });

    it("does not include store on the return value (current implementation)", () => {
        const store = { set: vi.fn(), get: vi.fn(), subscribe: vi.fn() };
        createMock.mockReturnValue(store);
        useMock.mockReturnValue({});

        const { result } = renderHook(() => useLocal());

        expect(result.current.store).toBeUndefined();
    });

    it("does not recreate store when initialState changes across renders", () => {
        const store = { set: vi.fn(), get: vi.fn(), subscribe: vi.fn() };
        createMock.mockReturnValue(store);
        useMock.mockReturnValue({});

        const { rerender } = renderHook(({ init }) => useLocal(init), {
            initialProps: { init: { x: 0 } },
        });

        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledWith({ x: 0 });

        rerender({ init: { x: 999 } });

        expect(createMock).toHaveBeenCalledTimes(1);
    });
});

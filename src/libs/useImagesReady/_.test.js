import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("../@baseStore", async () => {
    const React = await vi.importActual("react");

    const useLocal = (initialState = {}) => {
        const [state, setState] = React.useState(initialState);

        const setLocal = (patch) => {
            setState((prev) => {
                const next = typeof patch === "function" ? patch(prev) : patch;
                return { ...prev, ...(next ?? {}) };
            });
        };

        return { ...state, setLocal };
    };

    return { baseStore: { useLocal } };
});

import { useImagesReady } from "./index";

const makeImg = ({
    id = "",
    className = "",
    complete = false,
    naturalWidth = 0,
    tag = "img",
} = {}) => {
    const el = document.createElement(tag);
    if (id) el.id = id;
    if (className) el.className = className;

    Object.defineProperty(el, "complete", {
        configurable: true,
        get: () => complete,
    });

    Object.defineProperty(el, "naturalWidth", {
        configurable: true,
        get: () => naturalWidth,
    });

    return el;
};

describe("useImagesReady", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("returns true immediately when there are no matching images and calls fn once", async () => {
        const fn = vi.fn();

        const { result } = renderHook(() => useImagesReady(fn));

        await waitFor(() => {
            expect(result.current).toBe(true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("returns true immediately when all matching images are already done", async () => {
        const fn = vi.fn();
        const img1 = makeImg({ complete: true, naturalWidth: 10 });
        const img2 = makeImg({ complete: true, naturalWidth: 0 });
        document.body.appendChild(img1);
        document.body.appendChild(img2);

        const { result } = renderHook(() => useImagesReady(fn, { includeErrors: true }));

        await waitFor(() => {
            expect(result.current).toBe(true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("waits for events, then marks loaded and calls fn once", async () => {
        const fn = vi.fn();
        const img1 = makeImg({ complete: false, naturalWidth: 0 });
        const img2 = makeImg({ complete: false, naturalWidth: 0 });
        document.body.appendChild(img1);
        document.body.appendChild(img2);

        const add1 = vi.spyOn(img1, "addEventListener");
        const add2 = vi.spyOn(img2, "addEventListener");
        const rem1 = vi.spyOn(img1, "removeEventListener");
        const rem2 = vi.spyOn(img2, "removeEventListener");

        const completeMap = new WeakMap([
            [img1, false],
            [img2, false],
        ]);

        Object.defineProperty(img1, "complete", {
            configurable: true,
            get: () => completeMap.get(img1),
        });
        Object.defineProperty(img2, "complete", {
            configurable: true,
            get: () => completeMap.get(img2),
        });

        const { result } = renderHook(() => useImagesReady(fn, { includeErrors: true }));

        expect(result.current).toBe(false);
        expect(add1).toHaveBeenCalled();
        expect(add2).toHaveBeenCalled();

        await act(() => {
            completeMap.set(img1, true);
            img1.dispatchEvent(new Event("load"));
        });

        expect(result.current).toBe(false);
        expect(fn).toHaveBeenCalledTimes(0);

        await act(() => {
            completeMap.set(img2, true);
            img2.dispatchEvent(new Event("error"));
        });

        await waitFor(() => {
            expect(result.current).toBe(true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
        expect(rem1).toHaveBeenCalled();
        expect(rem2).toHaveBeenCalled();
    });

    it("when includeErrors is false, errored images are not considered ready if naturalWidth is 0", async () => {
        const fn = vi.fn();
        const img1 = makeImg({ complete: false, naturalWidth: 10 });
        const img2 = makeImg({ complete: false, naturalWidth: 0 });
        document.body.appendChild(img1);
        document.body.appendChild(img2);

        const state = new WeakMap([
            [img1, { complete: false, naturalWidth: 10 }],
            [img2, { complete: false, naturalWidth: 0 }],
        ]);

        Object.defineProperty(img1, "complete", {
            configurable: true,
            get: () => state.get(img1).complete,
        });
        Object.defineProperty(img2, "complete", {
            configurable: true,
            get: () => state.get(img2).complete,
        });

        Object.defineProperty(img1, "naturalWidth", {
            configurable: true,
            get: () => state.get(img1).naturalWidth,
        });
        Object.defineProperty(img2, "naturalWidth", {
            configurable: true,
            get: () => state.get(img2).naturalWidth,
        });

        const { result } = renderHook(() => useImagesReady(fn, { includeErrors: false }));

        await act(() => {
            state.set(img1, { complete: true, naturalWidth: 10 });
            img1.dispatchEvent(new Event("load"));
        });

        expect(result.current).toBe(false);
        expect(fn).toHaveBeenCalledTimes(0);

        await act(() => {
            state.set(img2, { complete: true, naturalWidth: 0 });
            img2.dispatchEvent(new Event("error"));
        });

        expect(result.current).toBe(false);
        expect(fn).toHaveBeenCalledTimes(0);

        await act(() => {
            state.set(img2, { complete: true, naturalWidth: 20 });
            img2.dispatchEvent(new Event("load"));
        });

        await waitFor(() => {
            expect(result.current).toBe(true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("uses selector to decide which images to track", async () => {
        const fn = vi.fn();
        const a = makeImg({ className: "track", complete: true, naturalWidth: 10 });
        const b = makeImg({ className: "ignore", complete: false, naturalWidth: 0 });
        document.body.appendChild(a);
        document.body.appendChild(b);

        const { result } = renderHook(() => useImagesReady(fn, { selector: "img.track" }));

        await waitFor(() => {
            expect(result.current).toBe(true);
        });

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("calls the latest fn after rerender", async () => {
        const fn1 = vi.fn();
        const fn2 = vi.fn();

        const img = makeImg({ complete: false, naturalWidth: 10 });
        document.body.appendChild(img);

        let done = false;
        Object.defineProperty(img, "complete", {
            configurable: true,
            get: () => done,
        });

        const { rerender, result } = renderHook(
            ({ fn }) => useImagesReady(fn, { includeErrors: true }),
            { initialProps: { fn: fn1 } },
        );

        rerender({ fn: fn2 });

        await act(() => {
            done = true;
            img.dispatchEvent(new Event("load"));
        });

        await waitFor(() => {
            expect(result.current).toBe(true);
        });

        expect(fn1).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(1);
    });
});

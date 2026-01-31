import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

let _state;
let _observerCallback;
let _observerOptions;
let observeSpy;
let disconnectSpy;

vi.mock("../@baseStore", async () => {
    const ReactActual = await vi.importActual("react");

    const useLocal = (initialState = {}) => {
        const [state, setState] = ReactActual.useState(() => {
            _state = initialState || {};
            return _state;
        });

        const setLocal = (patch) => {
            setState((prev) => {
                const base = prev || {};
                let next;
                if (typeof patch === "function") {
                    const draft = { ...base };
                    patch(draft);
                    next = draft;
                } else {
                    next = { ...base, ...(patch || {}) };
                }
                _state = next;
                return next;
            });
        };

        return { ...(state || {}), setLocal };
    };

    return { baseStore: { useLocal } };
});

import { useObserver } from "./index";

describe("useObserver", () => {
    beforeEach(() => {
        _state = null;
        _observerCallback = null;
        _observerOptions = null;

        observeSpy = vi.fn();
        disconnectSpy = vi.fn();

        globalThis.IntersectionObserver = function (cb, opts) {
            _observerCallback = cb;
            _observerOptions = opts;
            return {
                observe: observeSpy,
                disconnect: disconnectSpy,
            };
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns inViewport:true when IntersectionObserver is not available", () => {
        const prev = globalThis.IntersectionObserver;
        globalThis.IntersectionObserver = undefined;

        const { result } = renderHook(() => useObserver());
        expect(result.current.inViewport).toBe(true);

        globalThis.IntersectionObserver = prev;
    });

    it("observes node via ref(), updates inViewport and calls onEnter/onExit", () => {
        const onEnter = vi.fn();
        const onExit = vi.fn();

        const { result, unmount } = renderHook(() =>
            useObserver({ onEnter, onExit, threshold: 0.5, rootMargin: 10, root: null }),
        );

        const node = document.createElement("div");

        act(() => {
            result.current.ref(node);
        });

        expect(observeSpy).toHaveBeenCalled();
        expect(observeSpy.mock.calls.some(([arg]) => arg === node)).toBe(true);
        expect(_observerOptions).toEqual(
            expect.objectContaining({
                threshold: 0.5,
                rootMargin: "10px",
                root: null,
            }),
        );

        act(() => {
            _observerCallback?.([{ isIntersecting: true, target: node }]);
        });

        expect(result.current.inViewport).toBe(true);
        expect(onEnter).toHaveBeenCalled();
        expect(onExit).not.toHaveBeenCalled();

        act(() => {
            _observerCallback?.([{ isIntersecting: false, target: node }]);
        });

        expect(result.current.inViewport).toBe(false);
        expect(onExit).toHaveBeenCalled();

        unmount();
        expect(disconnectSpy).toHaveBeenCalled();
    });

    it("does not create observer until node is set", () => {
        const CtorSpy = vi.fn((cb, opts) => {
            _observerCallback = cb;
            _observerOptions = opts;
            return { observe: observeSpy, disconnect: disconnectSpy };
        });

        globalThis.IntersectionObserver = function (cb, opts) {
            return CtorSpy(cb, opts);
        };

        const { result } = renderHook(() => useObserver());

        expect(CtorSpy).toHaveBeenCalledTimes(0);

        const node = document.createElement("div");
        act(() => {
            result.current.ref(node);
        });

        expect(CtorSpy).toHaveBeenCalled();
    });

    it("uses latest onEnter/onExit after rerender", () => {
        const onEnter1 = vi.fn();
        const onExit1 = vi.fn();
        const onEnter2 = vi.fn();
        const onExit2 = vi.fn();

        const { result, rerender } = renderHook(
            ({ onEnter, onExit }) => useObserver({ onEnter, onExit }),
            { initialProps: { onEnter: onEnter1, onExit: onExit1 } },
        );

        const node = document.createElement("div");

        act(() => {
            result.current.ref(node);
        });

        act(() => {
            _observerCallback?.([{ isIntersecting: true, target: node }]);
        });

        expect(onEnter1).toHaveBeenCalled();
        expect(onEnter2).not.toHaveBeenCalled();

        rerender({ onEnter: onEnter2, onExit: onExit2 });

        act(() => {
            _observerCallback?.([{ isIntersecting: false, target: node }]);
        });

        expect(onExit2).toHaveBeenCalled();
    });
});

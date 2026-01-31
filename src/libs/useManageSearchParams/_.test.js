import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

let _rrdState;

vi.mock("../@baseStore", async () => {
    const React = await vi.importActual("react");

    const baseStore = {
        useReactRouterDom: () => _rrdState,
        reactRouterDomData: { get: () => _rrdState },

        // burada gerekmiyor ama dursun
        useLocal: (init) => {
            const [s, setS] = React.useState(init);
            const setLocal = (patch) =>
                setS((prev) => ({
                    ...prev,
                    ...(typeof patch === "function" ? patch(prev) : patch),
                }));
            return { ...s, setLocal };
        },
    };

    return { baseStore };
});

import { useManageSearchParams } from "./index";
import { manageSearchParams } from "./manageSearchParams";

describe("useManageSearchParams + manageSearchParams (single suite)", () => {
    const originalAtob = globalThis.atob;
    const originalBtoa = globalThis.btoa;

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();

        // IMPORTANT:
        // Encoded string MUST NOT contain "(*" otherwise get() treats it as raw.
        globalThis.btoa = (s) => "ENC:" + encodeURIComponent(String(s));
        globalThis.atob = (s) => {
            const str = String(s);
            if (!str.startsWith("ENC:")) throw new Error("bad");
            return decodeURIComponent(str.slice(4));
        };

        _rrdState = {
            navigate: vi.fn(),
            location: { pathname: "/x", search: "" },
        };
    });

    afterEach(() => {
        globalThis.atob = originalAtob;
        globalThis.btoa = originalBtoa;
    });

    // ---------------- manageSearchParams direct tests ----------------

    it("manageSearchParams.get(): empty search => {}", () => {
        _rrdState.location.search = "";
        const [obj] = manageSearchParams.get();
        expect(obj).toEqual({});
    });

    it("manageSearchParams.get(): parses RAW typed payload when contains '(*'", () => {
        _rrdState.location.search = "?a=(*1*)3&b[x]=(*0*)hello&flags[enabled]=(*6*)true";
        const [obj, raw] = manageSearchParams.get();
        expect(obj).toEqual({ a: 3, b: { x: "hello" }, flags: { enabled: true } });
        expect(raw).toBe("a=(*1*)3&b[x]=(*0*)hello&flags[enabled]=(*6*)true");
    });

    it("manageSearchParams.get(): parses base64 payload", () => {
        const raw = "a=(*1*)2&x[y]=(*0*)ok";
        _rrdState.location.search = "?" + globalThis.btoa(raw);

        const [obj, decoded] = manageSearchParams.get();
        expect(obj).toEqual({ a: 2, x: { y: "ok" } });
        expect(decoded).toBe(raw);
    });

    it("manageSearchParams.set(): navigates by default (base64)", () => {
        const [payload, raw] = manageSearchParams.set({ a: 1, flags: { enabled: true } }, {});

        expect(payload.startsWith("ENC:")).toBe(true);
        expect(raw).toContain("a=");
        expect(raw).toContain("flags[enabled]=");

        expect(_rrdState.navigate).toHaveBeenCalledTimes(1);
        expect(_rrdState.navigate).toHaveBeenCalledWith(`/x?${payload}`, { replace: true });
    });

    it("manageSearchParams.set(): disableAToB writes raw query", () => {
        const [payload, raw] = manageSearchParams.set(
            { a: 1, b: { x: "hi" } },
            { disableAToB: true },
        );

        expect(payload).toBe(raw);
        expect(_rrdState.navigate).toHaveBeenCalledWith(`/x?${payload}`, { replace: true });
    });

    it("manageSearchParams.clear(): navigates to pathname only", () => {
        _rrdState.location.search = "?whatever";
        manageSearchParams.clear();
        expect(_rrdState.navigate).toHaveBeenCalledWith("/x", { replace: true });
    });

    // ---------------- useManageSearchParams hook tests ----------------

    it("useManageSearchParams: returns decoded params + raw + helpers", () => {
        const raw = "a=(*1*)3&b[x]=(*0*)hello";
        _rrdState.location.search = "?" + globalThis.btoa(raw);

        const { result } = renderHook(() => useManageSearchParams());

        expect(result.current.a).toBe(3);
        expect(result.current.b).toEqual({ x: "hello" });
        expect(result.current.raw).toBe(raw);
        expect(typeof result.current.set).toBe("function");
        expect(typeof result.current.clear).toBe("function");
    });

    it("useManageSearchParams: supports defaults + pick", () => {
        const raw = "page=(*1*)2&filter=(*0*)x&extra=(*0*)nope";
        _rrdState.location.search = "?" + globalThis.btoa(raw);

        const { result } = renderHook(() =>
            useManageSearchParams({
                pick: ["page", "filter", "missing"],
                defaults: { page: 1, missing: "m" },
            }),
        );

        expect(result.current.page).toBe(2);
        expect(result.current.filter).toBe("x");
        expect(result.current.missing).toBe("m");
        expect(result.current.extra).toBeUndefined();
    });

    it("useManageSearchParams.set(): delegates to manageSearchParams.set with replace/maxLength defaults", () => {
        const spy = vi.spyOn(manageSearchParams, "set");

        const { result } = renderHook(() =>
            useManageSearchParams({ replace: false, maxLength: 99 }),
        );

        act(() => {
            result.current.set({ a: 1 });
        });

        expect(spy).toHaveBeenCalledTimes(1);
        const [_obj, settings] = spy.mock.calls[0];
        expect(_obj).toEqual({ a: 1 });
        expect(settings).toEqual(expect.objectContaining({ replace: false, maxLength: 99 }));
    });

    it("useManageSearchParams.clear(): delegates to manageSearchParams.clear with replace", () => {
        const spy = vi.spyOn(manageSearchParams, "clear");

        const { result } = renderHook(() => useManageSearchParams({ replace: false }));

        act(() => {
            result.current.clear();
        });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ replace: false }));
    });

    it("useManageSearchParams: bind auto-syncs URL when bind changes and differs from decoded", () => {
        const spy = vi.spyOn(manageSearchParams, "set");

        const raw = "page=(*1*)1";
        _rrdState.location.search = "?" + globalThis.btoa(raw);

        const { rerender } = renderHook(
            ({ page }) =>
                useManageSearchParams({
                    bind: { page },
                    replace: true,
                    maxLength: 0,
                }),
            { initialProps: { page: 1 } },
        );

        // decoded(page=1) ile bind(page=1) aynı => ilk render'da SET atmamalı
        expect(spy).toHaveBeenCalledTimes(0);

        // bind değişince => set atmalı
        rerender({ page: 2 });
        expect(spy).toHaveBeenCalledTimes(1);

        const [nextObj, settings] = spy.mock.calls[0];
        expect(nextObj).toEqual(expect.objectContaining({ page: 2 }));
        expect(settings).toEqual(expect.objectContaining({ replace: true, maxLength: 0 }));
    });
});

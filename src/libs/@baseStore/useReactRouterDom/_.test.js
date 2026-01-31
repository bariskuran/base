import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReactRouterDom } from "./index";
import { reactRouterDomData } from "../reactRouterDomData";

describe("useReactRouterDom", () => {
    beforeEach(() => {
        reactRouterDomData.set({
            navigate: null,
            navigateWithSearch: null,
            location: null,
            useParams: {},
            searchParams: {},
        });
    });

    it("returns full state when selector is not provided", () => {
        reactRouterDomData.set({
            navigate: "NAV",
            location: { pathname: "/test" },
        });

        const { result } = renderHook(() => useReactRouterDom());

        expect(result.current).toEqual(
            expect.objectContaining({
                navigate: "NAV",
                location: { pathname: "/test" },
            }),
        );
    });

    it("returns selected value when selector is provided", () => {
        reactRouterDomData.set({
            navigate: "NAV_FN",
        });

        const { result } = renderHook(() => useReactRouterDom((s) => s.navigate));

        expect(result.current).toBe("NAV_FN");
    });

    it("updates when reactRouterDomData changes", () => {
        const { result } = renderHook(() => useReactRouterDom((s) => s.location));

        expect(result.current).toEqual({});

        act(() => {
            reactRouterDomData.set({
                location: { pathname: "/next" },
            });
        });

        expect(result.current).toEqual({ pathname: "/next" });
    });

    it("does not coerce falsy non-nullish values", () => {
        reactRouterDomData.set({
            navigate: 0,
        });

        const { result } = renderHook(() => useReactRouterDom((s) => s.navigate));

        expect(result.current).toBe(0);
    });

    it("returns empty object when selector result is null or undefined", () => {
        const { result } = renderHook(() => useReactRouterDom((s) => s.unknown));

        expect(result.current).toEqual({});
    });
});

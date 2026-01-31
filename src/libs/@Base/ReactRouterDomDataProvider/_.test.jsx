import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const navigateMock = vi.fn();
let locationMock = { pathname: "/users/42", search: "?q=1&x=2" };
let paramsMock = { id: "42" };
let searchParamsMock = new URLSearchParams("q=1&x=2");

vi.mock("react-router-dom", () => {
    return {
        useNavigate: () => navigateMock,
        useLocation: () => locationMock,
        useParams: () => paramsMock,
        useSearchParams: () => [searchParamsMock],
    };
});

vi.mock("../../@baseStore", () => {
    return {
        baseStore: {
            reactRouterDomData: {
                set: vi.fn(),
            },
        },
    };
});

import { baseStore } from "../../@baseStore";
import { ReactRouterDomDataProvider } from "./index";

describe("ReactRouterDomDataProvider", () => {
    beforeEach(() => {
        navigateMock.mockClear();
        baseStore.reactRouterDomData.set.mockClear();

        locationMock = { pathname: "/users/42", search: "?q=1&x=2" };
        paramsMock = { id: "42" };
        searchParamsMock = new URLSearchParams("q=1&x=2");
    });

    it("mount olduğunda baseStore.reactRouterDomData.set ile router verisini yazar", () => {
        render(<ReactRouterDomDataProvider />);

        expect(baseStore.reactRouterDomData.set).toHaveBeenCalledTimes(1);

        const payload = baseStore.reactRouterDomData.set.mock.calls[0][0];

        expect(payload).toEqual(
            expect.objectContaining({
                navigate: navigateMock,
                location: locationMock,
                params: paramsMock,
                searchParams: { q: "1", x: "2" },
                navigateWithSearch: expect.any(Function),
            }),
        );
    });

    it("navigateWithSearch, search param verilmezse mevcut location.search'i taşır", () => {
        render(<ReactRouterDomDataProvider />);

        const { navigateWithSearch } = baseStore.reactRouterDomData.set.mock.calls[0][0];

        navigateWithSearch("/abc");
        expect(navigateMock).toHaveBeenCalledWith({ pathname: "/abc", search: "?q=1&x=2" });
    });

    it("navigateWithSearch, search param verilirse onu kullanır", () => {
        render(<ReactRouterDomDataProvider />);

        const { navigateWithSearch } = baseStore.reactRouterDomData.set.mock.calls[0][0];

        navigateWithSearch("/abc", "?z=9");
        expect(navigateMock).toHaveBeenCalledWith({ pathname: "/abc", search: "?z=9" });
    });

    it("location / searchParams değişince store tekrar güncellenir", () => {
        const { rerender } = render(<ReactRouterDomDataProvider />);

        expect(baseStore.reactRouterDomData.set).toHaveBeenCalledTimes(1);

        locationMock = { pathname: "/settings", search: "?tab=profile" };
        paramsMock = {};
        searchParamsMock = new URLSearchParams("tab=profile");

        rerender(<ReactRouterDomDataProvider />);

        expect(baseStore.reactRouterDomData.set).toHaveBeenCalledTimes(2);

        const payload = baseStore.reactRouterDomData.set.mock.calls[1][0];
        expect(payload.location).toEqual(locationMock);
        expect(payload.params).toEqual(paramsMock);
        expect(payload.searchParams).toEqual({ tab: "profile" });
    });
});

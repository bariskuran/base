import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const routerProviderMock = vi.fn(() => null);
const createBrowserRouterMock = vi.fn();

vi.mock("react-router-dom", () => {
    return {
        RouterProvider: (props) => {
            routerProviderMock(props);
            return null;
        },
        createBrowserRouter: (...args) => createBrowserRouterMock(...args),
        Outlet: () => <div data-testid="outlet" />,
    };
});

vi.mock("../ReactRouterDomDataProvider", () => {
    return {
        ReactRouterDomDataProvider: () => <div data-testid="rrd-data-provider" />,
    };
});

import { RouterProviderWrapper, CoreRRDLayout } from "./index";

describe("RouterProviderWrapper", () => {
    beforeEach(() => {
        routerProviderMock.mockClear();
        createBrowserRouterMock.mockClear();
    });

    it("createBrowserRouter, CoreRRDLayout ile wrap edilmiş routes ile çağrılır", () => {
        const routes = [
            { path: "/a", element: <div>A</div> },
            { path: "/b", element: <div>B</div> },
        ];

        render(<RouterProviderWrapper routes={routes} />);

        expect(createBrowserRouterMock).toHaveBeenCalledTimes(1);

        const routerConfig = createBrowserRouterMock.mock.calls[0][0];

        expect(routerConfig).toHaveLength(1);
        expect(routerConfig[0]).toEqual(
            expect.objectContaining({
                element: expect.anything(),
                children: routes,
            }),
        );
    });

    it("RouterProvider, createBrowserRouter çıktısı ile render edilir", () => {
        const fakeRouter = { id: "router" };
        createBrowserRouterMock.mockReturnValue(fakeRouter);

        render(<RouterProviderWrapper routes={[]} />);

        expect(routerProviderMock).toHaveBeenCalledTimes(1);
        expect(routerProviderMock).toHaveBeenCalledWith(
            expect.objectContaining({
                router: fakeRouter,
            }),
        );
    });
});

describe("CoreRRDLayout", () => {
    it("ReactRouterDomDataProvider ve Outlet render edilir", () => {
        const { getByTestId } = render(<CoreRRDLayout />);

        expect(getByTestId("rrd-data-provider")).toBeTruthy();
        expect(getByTestId("outlet")).toBeTruthy();
    });
});

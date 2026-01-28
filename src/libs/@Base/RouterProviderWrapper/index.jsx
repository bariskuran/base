import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { ReactRouterDomDataProvider } from "../ReactRouterDomDataProvider";

export const CoreRRDLayout = () => (
    <>
        <ReactRouterDomDataProvider />
        <Outlet />
    </>
);

export const RouterProviderWrapper = ({ routes }) => {
    const router = useMemo(() => {
        return createBrowserRouter([
            {
                element: <CoreRRDLayout />,
                children: routes,
            },
        ]);
    }, [routes]);

    return <RouterProvider router={router} />;
};

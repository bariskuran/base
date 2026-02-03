import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { designSystemRoutes } from "../../DesignSystem";
import { baseStore } from "../../@baseStore";
import { GlobalDataProvider } from "../GlobalDataProvider";

export const CoreRRDLayout = ({ routes, projectSettings }) => (
    <>
        <GlobalDataProvider projectSettings={projectSettings} routes={routes} />
        <Outlet />
    </>
);

export const GlobalDataInjector = ({ routes, projectSettings }) => {
    const [isDevMode] = baseStore.useGlobal((s) => [s.isDevMode]);
    const router = useMemo(() => {
        return createBrowserRouter([
            {
                element: <CoreRRDLayout projectSettings={projectSettings} routes={routes} />,
                children: [...routes, ...(isDevMode ? designSystemRoutes : [])],
            },
        ]);
    }, [routes]);

    return <RouterProvider router={router} />;
};

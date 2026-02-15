import { RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { designSystemRoutes } from "../../DesignSystem";
import { baseStore } from "../../@baseStore";
import { GlobalDataProvider } from "../GlobalDataProvider";
import { IdleManager } from "../IdleManager";
import { ErrorPage } from "../ErrorPage";
import { LanguageManager } from "../LanguageManager";
import { PageLoadingManager } from "../loadingQueueManager";

export const CoreRRDLayout = ({ routes, projectSettings }) => {
    const [isGlobalReady, isThemeReady] = baseStore.useGlobal((s) => [
        s.isGlobalReady,
        s.isThemeReady,
    ]);

    if (!isGlobalReady || !isThemeReady)
        return <GlobalDataProvider projectSettings={projectSettings} routes={routes} />;
    return (
        <>
            <GlobalDataProvider projectSettings={projectSettings} routes={routes} />
            <IdleManager />
            <LanguageManager />
            <PageLoadingManager />
            <Outlet />
        </>
    );
};

export const GlobalDataAndRouter = ({ routes, projectSettings }) => {
    const [isDevMode, isGlobalReady, isThemeReady] = baseStore.useGlobal((s) => [
        s.isDevMode,
        s.isGlobalReady,
        s.isThemeReady,
    ]);

    const router = useMemo(
        () =>
            createBrowserRouter([
                {
                    element: <CoreRRDLayout projectSettings={projectSettings} routes={routes} />,
                    errorElement: <ErrorPage defaultCode={500} />,
                    children: [
                        ...(isGlobalReady && isThemeReady ? routes : []),
                        ...(isDevMode ? designSystemRoutes : []),
                        { path: "*", element: <Navigate to="/error?code=404" replace /> },
                        { path: "/error", element: <ErrorPage defaultCode={500} /> },
                    ],
                },
            ]),
        [routes, isGlobalReady, isThemeReady],
    );

    return <RouterProvider router={router} />;
};

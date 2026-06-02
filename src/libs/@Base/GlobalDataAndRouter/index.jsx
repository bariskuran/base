import { RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { getDesignSystemRoutes } from "../../DesignSystem";
import { baseStore } from "../../baseStore";
import { GlobalDataProvider } from "../GlobalDataProvider";
import { IdleManager } from "../../IdleManager";
import { ErrorPage } from "../ErrorPage";
import { LanguageManager } from "../LanguageManager";
import { PageLoadingManager } from "../loadingQueueManager";
import { NotifierListener } from "../../NotifierListener";

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
            <NotifierListener />
            <Outlet />
        </>
    );
};

export const GlobalDataAndRouter = ({ routes, projectSettings }) => {
    const [isDevMode, isGlobalReady, isThemeReady, enableDesignSystem, showInternalDs] =
        baseStore.useGlobal((s) => [
            s.isDevMode,
            s.isGlobalReady,
            s.isThemeReady,
            s.enableDesignSystem,
            !!s._adminSettings?.showInternalDs,
        ]);
    const isReady = isGlobalReady && isThemeReady;

    const router = useMemo(
        () =>
            createBrowserRouter([
                {
                    element: <CoreRRDLayout projectSettings={projectSettings} routes={routes} />,
                    errorElement: <ErrorPage defaultCode={500} />,
                    children: [
                        ...(isReady ? routes : []),
                        ...(isDevMode || enableDesignSystem ? getDesignSystemRoutes() : []),
                        { path: "*", element: <Navigate to="/error?code=404" replace /> },
                        { path: "/error", element: <ErrorPage defaultCode={500} /> },
                    ],
                },
            ]),
        [routes, isReady, isDevMode, enableDesignSystem, showInternalDs, projectSettings],
    );
    if (!isThemeReady) return null;
    return <RouterProvider router={router} />;
};

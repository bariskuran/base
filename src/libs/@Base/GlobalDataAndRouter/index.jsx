import { RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { lazy, Suspense, useMemo } from "react";
import { baseStore } from "../../baseStore";
import { GlobalDataProvider } from "../GlobalDataProvider";
import { IdleManager } from "../../IdleManager";
import { ErrorPage } from "../ErrorPage";
import { LanguageManager } from "../LanguageManager";
import { PageLoadingManager } from "../loadingQueueManager";
import { NotifierListener } from "helpers/NotifierListener";

// Keep the dynamic import itself behind a compile-time condition. The previous
// callback always contained an import(), so Vite emitted the entire Design System
// chunk graph even when its route was disabled.
const CAN_LOAD_DESIGN_SYSTEM =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_DESIGN_SYSTEM === "true";

const LazyDesignSystemRoutes = CAN_LOAD_DESIGN_SYSTEM
    ? lazy(() => import("../../DesignSystem/Routes.jsx"))
    : null;

const getDesignSystemRoutes = () => {
    if (!CAN_LOAD_DESIGN_SYSTEM || !LazyDesignSystemRoutes) return [];

    return [
        {
            path: "design-system/*",
            element: (
                <Suspense fallback={null}>
                    <LazyDesignSystemRoutes />
                </Suspense>
            ),
        },
    ];
};

export const CoreRRDLayout = ({ routes, preparedRoutes, projectSettings }) => {
    const [isGlobalReady, isThemeReady] = baseStore.useGlobal((s) => [
        s.isGlobalReady,
        s.isThemeReady,
    ]);

    if (!isGlobalReady || !isThemeReady)
        return (
            <GlobalDataProvider
                projectSettings={projectSettings}
                routes={routes}
                preparedRoutes={preparedRoutes}
            />
        );
    return (
        <>
            <GlobalDataProvider
                key="global-data-provider"
                projectSettings={projectSettings}
                routes={routes}
                preparedRoutes={preparedRoutes}
            />
            <IdleManager key="idle-manager" />
            <LanguageManager key="language-manager" />
            <PageLoadingManager key="page-loading-manager" />
            <NotifierListener key="notifier-listener" />
            <Outlet key="outlet" />
        </>
    );
};

export const GlobalDataAndRouter = ({ routes, preparedRoutes = [], projectSettings }) => {
    const [isGlobalReady, isThemeReady, showInternalDs] =
        baseStore.useGlobal((s) => [
            s.isGlobalReady,
            s.isThemeReady,
            !!s._adminSettings?.showInternalDs,
        ]);
    const isReady = isGlobalReady && isThemeReady;

    const router = useMemo(
        () =>
            createBrowserRouter([
                {
                    element: (
                        <CoreRRDLayout
                            projectSettings={projectSettings}
                            routes={routes}
                            preparedRoutes={preparedRoutes}
                        />
                    ),
                    errorElement: <ErrorPage defaultCode={500} />,
                    children: [
                        ...(isReady ? routes : []),
                        ...getDesignSystemRoutes(),
                        { path: "*", element: <Navigate to="/error?code=404" replace /> },
                        { path: "/error", element: <ErrorPage defaultCode={500} /> },
                    ],
                },
            ]),
        [routes, preparedRoutes, isReady, showInternalDs, projectSettings],
    );
    if (!isThemeReady) return null;
    return <RouterProvider router={router} />;
};

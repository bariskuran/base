import { SuspenseWrapper } from "./Suspense";
import { StyledComponentsWrapper } from "./styling";
import { GlobalDataAndRouter } from "./GlobalDataAndRouter";
import { useEffects } from "./useEffects";
import { useEffect, useMemo } from "react";
import { injectInitialRemAndBodyFontStyle } from "./styling/injectInitialRemAndBodyFontStyle";
import { buildAppRoutes } from "./prepareRoutes";

const Base = (props) => {
    const { routes: routesProp, projectSettings = {} } = props || {};

    const { appRoutes, preparedRoutes } = useMemo(() => {
        if (Array.isArray(routesProp) && routesProp.length > 0) {
            const prepared =
                routesProp[0]?.children ??
                (routesProp[0]?.Component ? [] : routesProp);
            return { appRoutes: routesProp, preparedRoutes: prepared };
        }
        return buildAppRoutes(projectSettings?.rrdSettings ?? {});
    }, [routesProp, projectSettings?.rrdSettings]);

    useEffect(() => {
        injectInitialRemAndBodyFontStyle(projectSettings?.styledSettings?.remSettings);
    }, []);

    useEffects();

    return (
        <SuspenseWrapper
            suspenseFallback={projectSettings.SuspenseFallback || <div>Suspence loading...</div>}
        >
            <StyledComponentsWrapper styledSettings={projectSettings.styledSettings}>
                <GlobalDataAndRouter
                    routes={appRoutes}
                    preparedRoutes={preparedRoutes}
                    projectSettings={projectSettings}
                />
            </StyledComponentsWrapper>
        </SuspenseWrapper>
    );
};
export default Base;

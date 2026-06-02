import { SuspenseWrapper } from "./Suspense";
import { StyledComponentsWrapper } from "./styling";
import { GlobalDataAndRouter } from "./GlobalDataAndRouter";
import { useEffects } from "./useEffects";
import { useEffect } from "react";
import { injectInitialRemAndBodyFontStyle } from "./styling/injectInitialRemAndBodyFontStyle";

const Base = (props) => {
    const { routes = [], projectSettings = {} } = props || {};

    useEffect(() => {
        injectInitialRemAndBodyFontStyle(projectSettings?.styledSettings?.remSettings);
    }, []);

    useEffects();


    return (
        <SuspenseWrapper
            suspenseFallback={projectSettings.SuspenseFallback || <div>Suspence loading...</div>}
            otherSuspenseProps={projectSettings.otherSuspenseProps}
        >
            <StyledComponentsWrapper styledSettings={projectSettings.styledSettings}>
                <GlobalDataAndRouter routes={routes} projectSettings={projectSettings} />
            </StyledComponentsWrapper>
        </SuspenseWrapper>
    );
};
export default Base;

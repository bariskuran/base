import { SuspenseWrapper } from "./Suspense";
import { StyledComponentsWrapper } from "./styling";
import { GlobalDataAndRouter } from "./GlobalDataAndRouter";
import { useEffects } from "./useEffects";

/**
 *  * @example
 * import { Base } from "@bariskuran/base";
 * <Base
 *      SuspenseFallback
 *      routes
 *      projectSettings
 * />
 */

const Base = (props) => {
    const {
        SuspenseFallback = <div>Suspence loading...</div>,
        routes = [],
        projectSettings = {},
    } = props || {};

    useEffects({ projectSettings });

    /* */
    return (
        <SuspenseWrapper
            suspenseFallback={SuspenseFallback}
            otherSuspenseProps={projectSettings.otherSuspenseProps}
        >
            <StyledComponentsWrapper styledSettings={projectSettings.styledSettings}>
                <GlobalDataAndRouter routes={routes} projectSettings={projectSettings} />
            </StyledComponentsWrapper>
        </SuspenseWrapper>
    );
};
export default Base;

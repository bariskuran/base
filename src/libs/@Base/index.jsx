import { SuspenseWrapper } from "./Suspense";
import { StyledComponentsWrapper } from "./styling";
import { GlobalDataInjector } from "./GlobalDataInjector";
import { useEffects } from "./useEffects";
import { IdleManager } from "../IdleManager";
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
            <IdleManager />
            <StyledComponentsWrapper styledSettings={projectSettings.styledSettings}>
                <GlobalDataInjector routes={routes} projectSettings={projectSettings} />
            </StyledComponentsWrapper>
        </SuspenseWrapper>
    );
};
export default Base;

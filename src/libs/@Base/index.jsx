import { ErrorWrapper } from "./errorBoundary";
import { SuspenseWrapper } from "./suspense";
import { StyledComponentsWrapper } from "./styling/styledComponentsWrapper";
import { GlobalDataProvider } from "./GlobalDataProvider";
import { ClientDataProvider } from "./ClientDataProvider";
import { RouterProviderWrapper } from "./RouterProviderWrapper";
import { useEffects } from "./useEffects";

/**
 *  * @example
 * import { Base } from "@bariskuran/base";
 * <Base
 *      errorFallback
 *      otherErrorBoundaryProps
 *      suspenseFallback
 *      otherSuspenseProps
 *      globalCoreStoreVariables
 *      theme
 *      globalStyle
 *      breakpoints
 *      maxAspRatio
 *      minAspRatio
 *      remSettings
 *      otherStyledComponentsProps
 *      primaryFont
 *      breakpoints
 *      theme
 *      router
 * />
 */

const Base = (props) => {
    const {
        // ERROR BOUNDARY
        errorFallback,
        otherErrorBoundaryProps,

        // SUSPENSE
        suspenseFallback,
        otherSuspenseProps,

        // STYLED COMPONENTS
        globalStyle,
        breakpoints,
        maxAspRatio,
        minAspRatio,
        remSettings,
        otherStyledComponentsProps,
        primaryFont,
        theme,

        // GLOBAL CONTEXT API
        globalCoreStoreVariables,

        // ROUTER
        routes,
    } = props || {};

    useEffects();

    /* */
    return (
        <ErrorWrapper
            errorFallback={errorFallback}
            otherErrorBoundaryProps={otherErrorBoundaryProps}
        >
            <SuspenseWrapper
                suspenseFallback={suspenseFallback}
                otherSuspenseProps={otherSuspenseProps}
            >
                <GlobalDataProvider
                    globalCoreStoreVariables={globalCoreStoreVariables}
                    theme={theme}
                />
                <ClientDataProvider
                    breakpoints={breakpoints}
                    maxAspRatio={maxAspRatio}
                    minAspRatio={minAspRatio}
                />
                <StyledComponentsWrapper
                    globalStyle={globalStyle}
                    maxAspRatio={maxAspRatio}
                    minAspRatio={minAspRatio}
                    breakpoints={breakpoints}
                    otherStyledComponentsProps={otherStyledComponentsProps}
                    primaryFont={primaryFont}
                    remSettings={remSettings}
                    theme={theme}
                >
                    <RouterProviderWrapper routes={routes} />
                </StyledComponentsWrapper>
            </SuspenseWrapper>
        </ErrorWrapper>
    );
};
export default Base;

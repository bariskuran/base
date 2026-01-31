import { ErrorWrapper } from "./errorBoundary";
import { SuspenseWrapper } from "./Suspense";
import { StyledComponentsWrapper } from "./styling";
import { GlobalDataProvider } from "./GlobalDataProvider";
import { ClientDataProvider } from "./ClientDataProvider";
import { RouterProviderWrapper } from "./RouterProviderWrapper";
import { useEffects } from "./useEffects";
import { useTheme } from "./styling/useTheme";
import { NotifierProvider } from "./NotifierProvider";
import { BaseDateProvider } from "./BaseDateProvider";

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
 *      baseDateSettings
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

        // NOTIFIER
        notifierSettings,

        // BASE DATE
        baseDateSettings,
    } = props || {};

    const themesData = useTheme({ theme });
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
                <GlobalDataProvider globalCoreStoreVariables={globalCoreStoreVariables} />
                <ClientDataProvider
                    breakpoints={breakpoints}
                    maxAspRatio={maxAspRatio}
                    minAspRatio={minAspRatio}
                />
                <NotifierProvider notifierSettings={notifierSettings} />
                {!baseDateSettings?.disable && (
                    <BaseDateProvider baseDateSettings={baseDateSettings} />
                )}
                <StyledComponentsWrapper
                    globalStyle={globalStyle}
                    maxAspRatio={maxAspRatio}
                    minAspRatio={minAspRatio}
                    breakpoints={breakpoints}
                    otherStyledComponentsProps={otherStyledComponentsProps}
                    primaryFont={primaryFont}
                    remSettings={remSettings}
                    theme={themesData || {}}
                >
                    <RouterProviderWrapper routes={routes} />
                </StyledComponentsWrapper>
            </SuspenseWrapper>
        </ErrorWrapper>
    );
};
export default Base;

import { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./useTheme";
import { generateMediaFunctions } from "./generateMediaFunctions";
import { prepareRemSettings } from "./prepareRemSettings";
import { GlobalStyle } from "./GlobalStyle";
import { DEFAULT_PRIMARY_FONT } from "../../../constants/DEFAULT_PRIMARY_FONT";
import { DEFAULT_GLOBAL_STYLE } from "../../../constants/DEFAULT_GLOBAL_STYLE";

export const StyledComponentsWrapper = ({ children, styledSettings }) => {
    const {
        globalStyle,
        maxAspRatio,
        minAspRatio,
        otherStyledComponentsProps,
        primaryFont,
        remSettings,
        breakpoints,
        themes,
    } = styledSettings || {};
    const theme = useTheme({ theme: themes });

    const mediaFunctions = useMemo(
        () => generateMediaFunctions({ maxAspRatio, minAspRatio, breakpoints }),
        [maxAspRatio, minAspRatio, breakpoints],
    );

    const preparedRemSettings = useMemo(
        () => prepareRemSettings({ remSettings, mediaFunctions }),
        [remSettings, mediaFunctions],
    );

    return (
        <ThemeProvider theme={{ ...theme, ...mediaFunctions }} {...otherStyledComponentsProps}>
            <GlobalStyle
                preparedRemSettings={preparedRemSettings}
                primaryFont={primaryFont || DEFAULT_PRIMARY_FONT}
                defaultGlobalStyle={DEFAULT_GLOBAL_STYLE}
                globalStyle={globalStyle}
            />
            {children}
        </ThemeProvider>
    );
};

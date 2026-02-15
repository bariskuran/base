import { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./useTheme";
import { generateMediaFunctions } from "./generateMediaFunctions";
import { prepareRemSettings } from "./prepareRemSettings";
import { GlobalStyle } from "./GlobalStyle";
import { DEFAULT_PRIMARY_FONT } from "../../../constants/DEFAULT_PRIMARY_FONT";
import { DEFAULT_GLOBAL_STYLE } from "../../../constants/DEFAULT_GLOBAL_STYLE";
import { ConfigProvider } from "antd";

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
        makeAntdTheme,
    } = styledSettings || {};

    const { theme, antdTheme } = useTheme({ theme: themes, makeAntdTheme });

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
            <ConfigProvider
                theme={{
                    ...antdTheme,
                    token: {
                        ...antdTheme?.token,
                        fontFamily: "inherit",
                    },
                }}
                tooltip={{
                    unique: true,
                }}
            >
                <GlobalStyle
                    preparedRemSettings={preparedRemSettings}
                    primaryFont={primaryFont || DEFAULT_PRIMARY_FONT}
                    defaultGlobalStyle={DEFAULT_GLOBAL_STYLE}
                    globalStyle={globalStyle}
                />
                {children}
            </ConfigProvider>
        </ThemeProvider>
    );
};

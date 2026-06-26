import { useEffect, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./useTheme";
import { generateMediaFunctions } from "./generateMediaFunctions";
import { prepareRemSettings } from "./prepareRemSettings";
import { GlobalStyle } from "./GlobalStyle";
import { DEFAULT_PRIMARY_FONT } from "../../../constants/DEFAULT_PRIMARY_FONT";
import { DEFAULT_GLOBAL_STYLE } from "../../../constants/DEFAULT_GLOBAL_STYLE";
import { collectFontImports, collectFontImportUrls, stripCssImports } from "./fontCss";

export const StyledComponentsWrapper = ({ children, styledSettings }) => {
    const {
        globalStyle,
        maxAspRatio,
        minAspRatio,
        otherStyledComponentsProps,
        fonts,
        primaryFont,
        remSettings,
        breakpoints,
        themes,
    } = styledSettings || {};

    const availableFonts = {
        primaryFont: primaryFont || DEFAULT_PRIMARY_FONT,
        ...(fonts || {}),
    };
    const primaryFontCss = stripCssImports(availableFonts.primaryFont);
    const fontImports = collectFontImports(availableFonts);
    const fontImportUrls = useMemo(() => collectFontImportUrls(availableFonts), [fonts, primaryFont]);

    const { theme } = useTheme({ theme: themes });

    const mediaFunctions = useMemo(
        () => generateMediaFunctions({ maxAspRatio, minAspRatio, breakpoints }),
        [maxAspRatio, minAspRatio, breakpoints],
    );

    const preparedRemSettings = useMemo(
        () => prepareRemSettings({ remSettings, mediaFunctions }),
        [remSettings, mediaFunctions],
    );

    useEffect(() => {
        if (typeof document === "undefined") return;

        fontImportUrls.forEach((href) => {
            const exists = Array.from(
                document.head.querySelectorAll('link[data-base-font-import="1"]'),
            ).some((link) => link.getAttribute("href") === href);
            if (exists) return;

            const link = document.createElement("link");
            link.setAttribute("data-base-font-import", "1");
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);
        });
    }, [fontImportUrls]);

    return (
        <ThemeProvider theme={{ ...theme, ...mediaFunctions }} {...otherStyledComponentsProps}>
            <GlobalStyle
                preparedRemSettings={preparedRemSettings}
                fontImports={fontImports}
                primaryFont={primaryFontCss}
                defaultGlobalStyle={DEFAULT_GLOBAL_STYLE}
                globalStyle={globalStyle}
            />
            {children}
        </ThemeProvider>
    );
};

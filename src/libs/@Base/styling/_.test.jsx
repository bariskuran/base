import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const themeProviderSpy = vi.fn();
const globalStyleSpy = vi.fn();

vi.mock("styled-components", async () => {
    const actual = await vi.importActual("styled-components");

    const ThemeProvider = (props) => {
        themeProviderSpy(props);
        return props?.children ?? null;
    };

    const createGlobalStyle = () => {
        const GlobalStyle = (props) => {
            globalStyleSpy(props);
            return null;
        };
        return GlobalStyle;
    };

    const css = (strings, ...exprs) => {
        let out = "";
        for (let i = 0; i < strings.length; i++) {
            out += strings[i] ?? "";
            if (i < exprs.length) out += String(exprs[i]);
        }
        return out;
    };

    return { ...actual, ThemeProvider, createGlobalStyle, css };
});

const generateMediaFunctionsSpy = vi.fn();

vi.mock("./generateMediaFunctions", async () => {
    const actual = await vi.importActual("./generateMediaFunctions");
    return {
        ...actual,
        generateMediaFunctions: (args) => {
            generateMediaFunctionsSpy(args);
            return actual.generateMediaFunctions(args);
        },
    };
});

const prepareRemSettingsSpy = vi.fn();
let _prepareRemSettingsOverride = undefined;

vi.mock("./prepareRemSettings", async () => {
    const actual = await vi.importActual("./prepareRemSettings");
    return {
        ...actual,
        prepareRemSettings: (args) => {
            prepareRemSettingsSpy(args);
            if (_prepareRemSettingsOverride !== undefined) return _prepareRemSettingsOverride;
            return actual.prepareRemSettings(args);
        },
    };
});

import { StyledComponentsWrapper } from "./index";
import { DEFAULT_PRIMARY_FONT } from "../../../constants/DEFAULT_PRIMARY_FONT";
import { DEFAULT_GLOBAL_STYLE } from "../../../constants/DEFAULT_GLOBAL_STYLE";

describe("styling bundle", () => {
    beforeEach(() => {
        themeProviderSpy.mockClear();
        globalStyleSpy.mockClear();
        generateMediaFunctionsSpy.mockClear();
        prepareRemSettingsSpy.mockClear();
        _prepareRemSettingsOverride = undefined;
    });

    it("StyledComponentsWrapper ThemeProvider sets theme to (customTheme + mediaFunctions)", () => {
        _prepareRemSettingsOverride = "REM_MIXIN";

        const customTheme = {
            light: {
                _props: { isDefault: true, label: { tr: "Açık", en: "Light" } },
                background: "#fff",
            },
            dark: {
                _props: { label: { tr: "Koyu", en: "Dark" } },
                background: "#000",
            },
        };

        const breakpoints = { tablet: [1], desktop: [2], large: [3], uhd: [4], uhd8: [5] };

        render(
            <StyledComponentsWrapper
                theme={customTheme}
                breakpoints={breakpoints}
                maxAspRatio={99}
                minAspRatio={11}
                remSettings={[[0, 1000, "15px"]]}
                globalStyle="GS"
                primaryFont="PF"
                otherStyledComponentsProps={{ "data-x": "y" }}
            >
                <div data-testid="child" />
            </StyledComponentsWrapper>,
        );

        expect(generateMediaFunctionsSpy).toHaveBeenCalledTimes(1);
        expect(generateMediaFunctionsSpy).toHaveBeenCalledWith({
            maxAspRatio: 99,
            minAspRatio: 11,
            breakpoints,
        });

        expect(prepareRemSettingsSpy).toHaveBeenCalledTimes(1);
        expect(prepareRemSettingsSpy.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                remSettings: [[0, 1000, "15px"]],
            }),
        );

        expect(themeProviderSpy).toHaveBeenCalledTimes(1);
        const tpProps = themeProviderSpy.mock.calls[0][0];

        expect(tpProps).toEqual(
            expect.objectContaining({
                theme: expect.objectContaining({
                    responsive: expect.any(Function),
                }),
            }),
        );
        expect(tpProps["data-x"]).toBe("y");

        expect(globalStyleSpy).toHaveBeenCalledTimes(1);
        const gsProps = globalStyleSpy.mock.calls[0][0];

        expect(gsProps).toEqual(
            expect.objectContaining({
                preparedRemSettings: "REM_MIXIN",
                primaryFont: "PF",
                defaultGlobalStyle: DEFAULT_GLOBAL_STYLE,
                globalStyle: "GS",
            }),
        );
    });

    it("StyledComponentsWrapper uses DEFAULT_PRIMARY_FONT fallback when primaryFont is not provided", () => {
        _prepareRemSettingsOverride = "REM_MIXIN";

        render(
            <StyledComponentsWrapper>
                <div />
            </StyledComponentsWrapper>,
        );

        const tpProps = themeProviderSpy.mock.calls[0][0];

        expect(tpProps.theme).toEqual(
            expect.objectContaining({
                responsive: expect.any(Function),
            }),
        );

        const gsProps = globalStyleSpy.mock.calls[0][0];
        expect(gsProps.primaryFont).toBe(DEFAULT_PRIMARY_FONT);
    });
});

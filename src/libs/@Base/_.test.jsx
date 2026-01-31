import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const errorWrapperSpy = vi.fn();
const suspenseWrapperSpy = vi.fn();
const styledWrapperSpy = vi.fn();
const globalDataProviderSpy = vi.fn();
const clientDataProviderSpy = vi.fn();
const routerProviderWrapperSpy = vi.fn();
const useEffectsSpy = vi.fn();

vi.mock("./useEffects", () => ({
    useEffects: () => useEffectsSpy(),
}));

vi.mock("./styling/useTheme", () => ({
    useTheme: () => ({
        theme: { background: "#fff" },
        setTheme: vi.fn(),
        themes: {},
        currentThemeKey: "light",
    }),
}));

vi.mock("./errorBoundary", () => ({
    ErrorWrapper: (props) => {
        errorWrapperSpy(props);
        return <div data-testid="ErrorWrapper">{props.children}</div>;
    },
}));

vi.mock("./Suspense", () => ({
    SuspenseWrapper: (props) => {
        suspenseWrapperSpy(props);
        return <div data-testid="SuspenseWrapper">{props.children}</div>;
    },
}));

vi.mock("./styling", () => ({
    StyledComponentsWrapper: (props) => {
        styledWrapperSpy(props);
        return <div data-testid="StyledComponentsWrapper">{props.children}</div>;
    },
}));

vi.mock("./GlobalDataProvider", () => ({
    GlobalDataProvider: (props) => {
        globalDataProviderSpy(props);
        return <div data-testid="GlobalDataProvider" />;
    },
}));

vi.mock("./ClientDataProvider", () => ({
    ClientDataProvider: (props) => {
        clientDataProviderSpy(props);
        return <div data-testid="ClientDataProvider" />;
    },
}));

vi.mock("./RouterProviderWrapper", () => ({
    RouterProviderWrapper: (props) => {
        routerProviderWrapperSpy(props);
        return <div data-testid="RouterProviderWrapper" />;
    },
}));

import Base from "./index.jsx";

describe("Base", () => {
    beforeEach(() => {
        errorWrapperSpy.mockClear();
        suspenseWrapperSpy.mockClear();
        styledWrapperSpy.mockClear();
        globalDataProviderSpy.mockClear();
        clientDataProviderSpy.mockClear();
        routerProviderWrapperSpy.mockClear();
        useEffectsSpy.mockClear();
    });

    it("wires wrappers and providers, and calls useEffects", () => {
        const theme = {
            light: {
                _props: { isDefault: true, label: { tr: "Açık", en: "Light" } },
                background: "#fff",
            },
            dark: {
                _props: { label: { tr: "Koyu", en: "Dark" } },
                background: "#000",
            },
        };

        const props = {
            errorFallback: <div data-testid="error-fallback" />,
            otherErrorBoundaryProps: { onError: vi.fn() },

            suspenseFallback: <div data-testid="suspense-fallback" />,
            otherSuspenseProps: { unstable_name: "x" },

            globalCoreStoreVariables: { a: 1 },

            theme,
            globalStyle: "GS",
            breakpoints: { xs: [0, 600] },
            maxAspRatio: 2,
            minAspRatio: 1,
            remSettings: [[0, 1000, "14px"]],
            otherStyledComponentsProps: { "data-x": "y" },
            primaryFont: "PF",

            routes: [{ path: "/", element: null }],
        };

        render(<Base {...props} />);

        expect(useEffectsSpy.mock.calls.length).toBeGreaterThanOrEqual(1);

        expect(screen.getByTestId("ErrorWrapper")).toBeTruthy();
        expect(screen.getByTestId("SuspenseWrapper")).toBeTruthy();
        expect(screen.getByTestId("GlobalDataProvider")).toBeTruthy();
        expect(screen.getByTestId("ClientDataProvider")).toBeTruthy();
        expect(screen.getByTestId("StyledComponentsWrapper")).toBeTruthy();
        expect(screen.getByTestId("RouterProviderWrapper")).toBeTruthy();

        expect(errorWrapperSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        const ewProps = errorWrapperSpy.mock.calls[0][0];
        expect(ewProps.errorFallback).toBe(props.errorFallback);
        expect(ewProps.otherErrorBoundaryProps).toBe(props.otherErrorBoundaryProps);

        expect(suspenseWrapperSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        const swProps = suspenseWrapperSpy.mock.calls[0][0];
        expect(swProps.suspenseFallback).toBe(props.suspenseFallback);
        expect(swProps.otherSuspenseProps).toBe(props.otherSuspenseProps);

        expect(globalDataProviderSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(globalDataProviderSpy.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                globalCoreStoreVariables: props.globalCoreStoreVariables,
            }),
        );

        expect(clientDataProviderSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(clientDataProviderSpy.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                breakpoints: props.breakpoints,
                maxAspRatio: props.maxAspRatio,
                minAspRatio: props.minAspRatio,
            }),
        );

        expect(styledWrapperSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        const scwProps = styledWrapperSpy.mock.calls[0][0];
        expect(scwProps).toEqual(
            expect.objectContaining({
                globalStyle: props.globalStyle,
                maxAspRatio: props.maxAspRatio,
                minAspRatio: props.minAspRatio,
                breakpoints: props.breakpoints,
                otherStyledComponentsProps: props.otherStyledComponentsProps,
                primaryFont: props.primaryFont,
                remSettings: props.remSettings,
            }),
        );

        expect(routerProviderWrapperSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(routerProviderWrapperSpy.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                routes: props.routes,
            }),
        );
    });

    it("renders without optional props", () => {
        render(<Base />);
        expect(useEffectsSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByTestId("RouterProviderWrapper")).toBeTruthy();
    });
});

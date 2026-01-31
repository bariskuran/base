import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

let _global = {};

vi.mock("../../../constants/DEFAULT_THEME", () => ({
    DEFAULT_THEME: {
        background: "DEF_BG",
        foreground: "DEF_FG",
        grey: "DEF_GREY",
        primary: "DEF_PRIMARY",
        secondary: "DEF_SECONDARY",
        error: "DEF_ERROR",
        success: "DEF_SUCCESS",
        warning: "DEF_WARNING",
    },
}));

vi.mock("../../@baseStore", async () => {
    const ReactActual = await vi.importActual("react");

    const globalData = {
        get: vi.fn(() => _global),
        set: vi.fn((patch) => {
            const next = typeof patch === "function" ? patch(_global) : patch;
            _global = { ..._global, ...(next || {}) };
            return _global;
        }),
    };

    const useLocal = (initial = {}) => {
        const [state, setState] = ReactActual.useState(initial || {});
        const setLocal = (patch) => {
            setState((prev) => {
                const next = typeof patch === "function" ? patch(prev) : patch;
                return { ...prev, ...(next || {}) };
            });
        };
        return { ...state, setLocal };
    };

    return { baseStore: { globalData, useLocal } };
});

import { baseStore } from "../../@baseStore";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
    beforeEach(() => {
        _global = {};
        baseStore.globalData.get.mockClear();
        baseStore.globalData.set.mockClear();
    });

    it("prepares basePalette and fills missing tokens across themes", async () => {
        const theme = {
            light: {
                _props: { isDefault: true, label: { tr: "Açık", en: "Light" } },
                background: "USER_LIGHT_BG",
                primary: "USER_LIGHT_PRIMARY",
            },
            dark: {
                _props: { label: { tr: "Koyu", en: "Dark" } },
                background: "USER_DARK_BG",
            },
        };

        const { result } = renderHook(() => useTheme({ theme }));
        await act(async () => {});

        expect(result.current.currentThemeKey).toBe("light");
        expect(result.current.theme.background).toBe("USER_LIGHT_BG");
        expect(result.current.theme.primary).toBe("USER_LIGHT_PRIMARY");
        expect(result.current.theme.grey).toBe("DEF_GREY");

        expect(result.current.themes.dark.background).toBe("USER_DARK_BG");
        expect(result.current.themes.dark.primary).toBe("USER_LIGHT_PRIMARY");
        expect(result.current.themes.dark.grey).toBe("DEF_GREY");
    });

    it("selects stored currentThemeLabel if present", async () => {
        _global = { currentThemeLabel: "dark" };

        const theme = {
            light: {
                _props: { isDefault: true, label: { tr: "Açık", en: "Light" } },
                background: "L_BG",
                primary: "L_PRIMARY",
            },
            dark: {
                _props: { label: { tr: "Koyu", en: "Dark" } },
                background: "D_BG",
            },
        };

        const { result } = renderHook(() => useTheme({ theme }));
        await act(async () => {});

        expect(result.current.currentThemeKey).toBe("dark");
        expect(result.current.theme.background).toBe("D_BG");
        expect(result.current.theme.primary).toBe("L_PRIMARY");
    });

    it("falls back to default when stored key is invalid", async () => {
        _global = { currentThemeLabel: "nope" };

        const theme = {
            light: {
                _props: { isDefault: true },
                background: "L_BG",
                primary: "L_PRIMARY",
            },
            dark: {
                background: "D_BG",
            },
        };

        const { result } = renderHook(() => useTheme({ theme }));
        await act(async () => {});

        expect(result.current.currentThemeKey).toBe("light");
        expect(result.current.theme.background).toBe("L_BG");
        expect(result.current.theme.primary).toBe("L_PRIMARY");
    });

    it("setTheme writes theme colors + currentThemeLabel to globalData", async () => {
        const theme = {
            light: {
                _props: { isDefault: true, label: { tr: "Açık", en: "Light" } },
                background: "L_BG",
                primary: "L_PRIMARY",
            },
            dark: {
                _props: { label: { tr: "Koyu", en: "Dark" } },
                background: "D_BG",
            },
        };

        const { result } = renderHook(() => useTheme({ theme }));
        await act(async () => {});
        baseStore.globalData.set.mockClear();

        act(() => {
            result.current.setTheme("dark");
        });

        const stored = baseStore.globalData.get();
        expect(stored.currentThemeLabel).toBe("dark");
        expect(stored.theme).toMatchObject({
            background: "D_BG",
            primary: "L_PRIMARY",
        });

        const calls = baseStore.globalData.set.mock.calls.map((c) => c[0]);
        const hasThemeWrite = calls.some(
            (p) => p && typeof p === "object" && p.currentThemeLabel === "dark" && p.theme,
        );
        expect(hasThemeWrite).toBe(true);
    });
});

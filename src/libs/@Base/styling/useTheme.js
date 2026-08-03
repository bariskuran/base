import { useMemo, useCallback, useEffect } from "react";
import { baseStore } from "../../baseStore";
import { DEFAULT_THEME } from "../../../constants/DEFAULT_THEME";
import { buildThemeWithScales, packTheme } from "../../COLORS/themeScales";

export const useTheme = ({ theme } = {}) => {
    const {
        theme: currentColors,
        currentThemeKey,
        currentThemeLabelObj,
        set,
    } = baseStore.useLocal({
        theme: {},
        currentThemeKey: null,
        currentThemeLebelObj: null,
    });

    const preparedThemes = useMemo(() => {
        const input = theme && typeof theme === "object" ? theme : {};
        const keys = Object.keys(input);

        const pickColorsOnly = (t) => {
            if (!t || typeof t !== "object") return {};
            const { _props, ...rest } = t;
            return rest || {};
        };

        const defaultKey = keys.find((k) => input?.[k]?._props?.isDefault) || keys[0] || "default";

        const defaultThemeColors = pickColorsOnly(input[defaultKey]);
        const basePaletteRaw = { ...(DEFAULT_THEME || {}), ...(defaultThemeColors || {}) };

        const out = {};
        for (const k of keys) {
            const t = input[k] || {};
            const colorsRaw = pickColorsOnly(t);

            const mergedRaw = { ...basePaletteRaw, ...colorsRaw };
            const built = buildThemeWithScales(mergedRaw);

            out[k] = {
                _props: {
                    ...(t._props || {}),
                    ...(k === defaultKey ? { isDefault: true } : {}),
                },
                ...packTheme(built),
            };
        }

        if (!out[defaultKey]) {
            const built = buildThemeWithScales(basePaletteRaw);
            out[defaultKey] = {
                _props: { isDefault: true, label: { tr: "Varsayılan", en: "Default" } },
                ...packTheme(built),
            };
        }

        out._meta = { defaultKey, basePalette: basePaletteRaw };

        return out;
    }, [theme]);

    const selectedKey = useMemo(() => {
        const storedKey = baseStore.globalData.get?.()?.currentThemeLabel;
        const defaultKey = preparedThemes?._meta?.defaultKey;
        if (storedKey && preparedThemes?.[storedKey]) return storedKey;
        return defaultKey;
    }, [preparedThemes]);

    // `useLocal` starts empty and is synchronised in an effect below. Returning
    // the prepared default synchronously prevents the first production paint from
    // receiving an empty styled-components theme.
    const resolvedTheme = useMemo(() => {
        if (Object.keys(currentColors || {}).length > 0) return currentColors;

        const selectedTheme = preparedThemes?.[selectedKey];
        if (!selectedTheme) return {};

        const { _props, ...themePacked } = selectedTheme;
        return themePacked;
    }, [currentColors, preparedThemes, selectedKey]);

    useEffect(() => {
        const t = preparedThemes?.[selectedKey];
        if (!t) return;

        const { _props, ...themePacked } = t;

        set?.({
            theme: themePacked,
            currentThemeKey: selectedKey,
            currentThemeLabelObj: _props?.label || null,
        });
    }, [preparedThemes, selectedKey, set]);

    const setTheme = useCallback(
        (themeKey) => {
            const next = preparedThemes?.[themeKey];

            const fallbackKey =
                Object.keys(preparedThemes || {}).find(
                    (k) => preparedThemes?.[k]?._props?.isDefault,
                ) || preparedThemes?._meta?.defaultKey;

            const chosen = next || preparedThemes?.[fallbackKey];
            if (!chosen) return;

            const { _props, ...themePacked } = chosen;

            set?.({
                theme: themePacked,
                currentThemeKey: themeKey,
                currentThemeLabelObj: _props?.label || null,
            });

            baseStore.globalData.set?.({
                theme: themePacked,
                currentThemeLabel: themeKey,
                isThemeReady: true,
            });
        },
        [preparedThemes, set],
    );

    useEffect(() => {
        baseStore.globalData.set?.({
            theme: resolvedTheme,
            currentThemeLabel: currentThemeKey,
            currentThemeLabelObj,
            setTheme,
            themes: preparedThemes,
            isThemeReady: Object.keys(resolvedTheme).length > 0,
        });
    }, [resolvedTheme, currentThemeKey, currentThemeLabelObj, setTheme, preparedThemes]);

    return { theme: resolvedTheme };
};

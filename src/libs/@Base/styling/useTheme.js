import { useMemo, useCallback, useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { DEFAULT_THEME } from "../../../constants/DEFAULT_THEME";
import { useImmer } from "../../useImmer";

export const useTheme = ({ theme } = {}) => {
    const [{ theme: currentColors, currentThemeKey, currentThemeLabelObj }, setImmer] = useImmer({
        theme: {},
        currentThemeKey: null,
        currentThemeLebelObj: null,
    });

    const preparedThemes = useMemo(() => {
        const input = theme && typeof theme === "object" ? theme : {};
        const keys = Object.keys(input);

        const pickColorsOnly = (t) => {
            if (!t || typeof t !== "object") return {};
            const { _props, ...colors } = t;
            return colors || {};
        };

        const defaultKey = keys.find((k) => input?.[k]?._props?.isDefault) || keys[0] || "default";

        const defaultThemeColors = pickColorsOnly(input[defaultKey]);
        const basePalette = { ...(DEFAULT_THEME || {}), ...(defaultThemeColors || {}) };

        const out = {};
        for (const k of keys) {
            const t = input[k] || {};
            const colors = pickColorsOnly(t);

            out[k] = {
                _props: {
                    ...(t._props || {}),
                    ...(k === defaultKey ? { isDefault: true } : {}),
                },
                ...basePalette,
                ...colors,
            };
        }

        if (!out[defaultKey]) {
            out[defaultKey] = {
                _props: { isDefault: true, label: { tr: "Varsayılan", en: "Default" } },
                ...basePalette,
            };
        }

        out._meta = { defaultKey, basePalette };

        return out;
    }, [theme]);

    const selectedKey = useMemo(() => {
        const storedKey = baseStore.globalData.get?.()?.currentThemeLabel;
        const defaultKey = preparedThemes?._meta?.defaultKey;
        if (storedKey && preparedThemes?.[storedKey]) return storedKey;
        return defaultKey;
    }, [preparedThemes]);

    useEffect(() => {
        const t = preparedThemes?.[selectedKey];
        if (!t) return;

        const { _props, ...colors } = t;

        setImmer?.({
            theme: colors,
            currentThemeKey: selectedKey,
            currentThemeLabelObj: _props?.label || null,
        });
    }, [preparedThemes, selectedKey]);

    const setTheme = useCallback(
        (themeKey) => {
            const next = preparedThemes?.[themeKey];

            const fallbackKey =
                Object.keys(preparedThemes || {}).find(
                    (k) => preparedThemes?.[k]?._props?.isDefault,
                ) || preparedThemes?._meta?.defaultKey;

            const chosen = next || preparedThemes?.[fallbackKey];
            if (!chosen) return;

            const { _props, ...colors } = chosen;

            setImmer?.({
                theme: colors,
                currentThemeKey: themeKey,
                currentThemeLabelObj: _props?.label || null,
            });

            baseStore.globalData.set?.({
                theme: colors,
                currentThemeLabel: themeKey,
            });
        },
        [preparedThemes],
    );

    useEffect(() => {
        baseStore.globalData.set?.({
            theme: currentColors,
            currentThemeLabel: currentThemeKey,
            currentThemeLabelObj,
            setTheme,
            themes: preparedThemes,
        });
    }, [currentColors, currentThemeKey, currentThemeLabelObj, setTheme, preparedThemes]);

    return currentColors;
};

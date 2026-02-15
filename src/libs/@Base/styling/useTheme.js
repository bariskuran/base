import { useMemo, useCallback, useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { DEFAULT_THEME, makeAntdTheme } from "../../../constants/DEFAULT_THEME";
import { colorTinter } from "../../colorTinter";
import { colorShader } from "../../colorShader";

const isString = (v) => typeof v === "string" && v.length > 0;

const buildScale = (hex) => {
    const base = String(hex);
    const out = {};

    for (let i = 1; i <= 100; i += 1) {
        out["tint" + i] = colorTinter(base, 100 - i);
        out["shade" + i] = colorShader(base, 100 - i);
    }

    return out;
};

const buildThemeWithScales = (palette) => {
    const src = palette || {};
    const colors = {};
    const scales = {};

    for (const k of Object.keys(src)) {
        const v = src[k];
        colors[k] = v;
        if (isString(v)) scales[k] = buildScale(v);
    }

    return { colors, scales };
};

export const useTheme = ({ theme, makeAntdTheme: makeAntdThemeOverride } = {}) => {
    const {
        theme: currentColors,
        currentThemeKey,
        currentThemeLabelObj,
        setLocal,
    } = baseStore.useLocal({
        theme: {},
        currentThemeKey: null,
        currentThemeLebelObj: null,
    });

    const [preparedThemes, antdTheme] = useMemo(() => {
        const input = theme && typeof theme === "object" ? theme : {};
        const keys = Object.keys(input);

        const pickColorsOnly = (t) => {
            if (!t || typeof t !== "object") return {};
            const { _props, ...colors } = t;
            return colors || {};
        };

        const defaultKey = keys.find((k) => input?.[k]?._props?.isDefault) || keys[0] || "default";

        const defaultThemeColors = pickColorsOnly(input[defaultKey]);
        const basePaletteRaw = { ...(DEFAULT_THEME || {}), ...(defaultThemeColors || {}) };

        const antdTheme = makeAntdThemeOverride
            ? makeAntdThemeOverride(basePaletteRaw)
            : makeAntdTheme(basePaletteRaw);

        const out = {};
        for (const k of keys) {
            const t = input[k] || {};
            const colorsRaw = pickColorsOnly(t);

            const mergedRaw = { ...basePaletteRaw, ...colorsRaw };
            const { colors, scales } = buildThemeWithScales(mergedRaw);

            out[k] = {
                _props: {
                    ...(t._props || {}),
                    ...(k === defaultKey ? { isDefault: true } : {}),
                },
                ...colors,
                _scales: scales,
            };
        }

        if (!out[defaultKey]) {
            const { colors, scales } = buildThemeWithScales(basePaletteRaw);
            out[defaultKey] = {
                _props: { isDefault: true, label: { tr: "Varsayılan", en: "Default" } },
                ...colors,
                _scales: scales,
            };
        }

        out._meta = { defaultKey, basePalette: basePaletteRaw };

        return [out, antdTheme];
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

        const { _props, _scales, ...colors } = t;

        setLocal?.({
            theme: {
                ...colors,
                backgrounds: _scales?.background || {},
                foregrounds: _scales?.foreground || {},
                greys: _scales?.grey || {},
                primarys: _scales?.primary || {},
                secondarys: _scales?.secondary || {},
                errors: _scales?.error || {},
                successs: _scales?.success || {},
                warnings: _scales?.warning || {},
                _scales: _scales || {},
            },
            currentThemeKey: selectedKey,
            currentThemeLabelObj: _props?.label || null,
        });
    }, [preparedThemes, selectedKey, setLocal]);

    const setTheme = useCallback(
        (themeKey) => {
            const next = preparedThemes?.[themeKey];

            const fallbackKey =
                Object.keys(preparedThemes || {}).find(
                    (k) => preparedThemes?.[k]?._props?.isDefault,
                ) || preparedThemes?._meta?.defaultKey;

            const chosen = next || preparedThemes?.[fallbackKey];
            if (!chosen) return;

            const { _props, _scales, ...colors } = chosen;

            const packed = {
                ...colors,
                backgrounds: _scales?.background || {},
                foregrounds: _scales?.foreground || {},
                greys: _scales?.grey || {},
                primarys: _scales?.primary || {},
                secondarys: _scales?.secondary || {},
                errors: _scales?.error || {},
                successs: _scales?.success || {},
                warnings: _scales?.warning || {},
                _scales: _scales || {},
            };

            setLocal?.({
                theme: packed,
                currentThemeKey: themeKey,
                currentThemeLabelObj: _props?.label || null,
            });

            baseStore.globalData.set?.({
                theme: packed,
                currentThemeLabel: themeKey,
                isThemeReady: true,
            });
        },
        [preparedThemes, setLocal],
    );

    useEffect(() => {
        baseStore.globalData.set?.({
            theme: currentColors,
            currentThemeLabel: currentThemeKey,
            currentThemeLabelObj,
            setTheme,
            themes: preparedThemes,
            isThemeReady: Object.keys(currentColors).length > 0 ? true : false,
        });
    }, [currentColors, currentThemeKey, currentThemeLabelObj, setTheme, preparedThemes]);

    return { theme: currentColors, antdTheme };
};

import { useMemo, useCallback, useEffect } from "react";
import { baseStore } from "../../baseStore";
import { DEFAULT_THEME, makeAntdTheme } from "../../../constants/DEFAULT_THEME";
import { colorTinter } from "../../colorTinter";
import { colorShader } from "../../colorShader";

const isString = (v) => typeof v === "string" && v.length > 0;

const THEME_SCALE_KEYS = [
    ["background", "backgrounds"],
    ["foreground", "foregrounds"],
    ["grey", "greys"],
    ["primary", "primarys"],
    ["secondary", "secondarys"],
    ["error", "errors"],
    ["success", "successs"],
    ["warning", "warnings"],
];

const buildGreyScale = () => {
    const out = {};

    for (let i = 1; i <= 100; i += 1) {
        out["tint" + i] = colorTinter("#000000", i);
        out["shade" + i] = colorShader("#ffffff", i);
    }

    return out;
};

const buildScale = (hex, key) => {
    if (key === "grey") {
        return buildGreyScale();
    }

    const base = String(hex);
    const out = {};

    for (let i = 1; i <= 100; i += 1) {
        out["tint" + i] = colorTinter(base, i);
        out["shade" + i] = colorShader(base, i);
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
        if (isString(v)) scales[k] = buildScale(v, k);
    }

    return { colors, scales };
};

const packTheme = ({ colors, scales }) => {
    const packed = { ...(colors || {}) };

    for (const [scaleKey, packedKey] of THEME_SCALE_KEYS) {
        if (scales?.[scaleKey]) {
            packed[packedKey] = scales[scaleKey];
        }
    }

    return packed;
};

export const useTheme = ({ theme, makeAntdTheme: makeAntdThemeOverride } = {}) => {
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

    const [preparedThemes, antdTheme] = useMemo(() => {
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

        const antdTheme = makeAntdThemeOverride
            ? makeAntdThemeOverride(basePaletteRaw)
            : makeAntdTheme(basePaletteRaw);

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

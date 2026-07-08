import { colorTinter } from "../colorTinter";
import { colorShader } from "../colorShader";

const isString = (v) => typeof v === "string" && v.length > 0;

export const THEME_SCALE_KEYS = [
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

export const buildScale = (hex, key) => {
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

export const buildThemeWithScales = (palette) => {
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

export const packTheme = ({ colors, scales }) => {
    const packed = { ...(colors || {}) };

    for (const [scaleKey, packedKey] of THEME_SCALE_KEYS) {
        if (scales?.[scaleKey]) {
            packed[packedKey] = scales[scaleKey];
        }
    }

    return packed;
};

import { colorConverter } from "../../colorConverter";
import { colorShader } from "../../colorShader";
import { colorAlpha } from "../../colorAlpha";
import { colorTinter } from "../../colorTinter";
import { colorFind } from "../../colorFind";

export const resolvePathOrRaw = (theme, v) => {
    if (v == null || v === "") return null;
    return colorFind(v, { theme, output: "hex8" }) || v;
};

const getInteractiveRate = (baseRate, luminanceValue, type = "hover") => {
    if (typeof luminanceValue !== "number") {
        return type === "active" ? baseRate * 2 : baseRate;
    }
    const base = type === "active" ? baseRate * 2 : baseRate;
    const multiplier = luminanceValue < 0.5 ? 1 + (0.5 - luminanceValue) * 2.4 : 1;
    return Math.min(100, base * multiplier);
};

const contrastFromTheme = (theme) => {
    const isForegroundLight = colorConverter(theme.foreground).luminance >= 0.5;
    return {
        lightColor: isForegroundLight ? theme.foreground : theme.background,
        darkColor: isForegroundLight ? theme.background : theme.foreground,
    };
};

const isForegroundLightGlobal = (theme) => colorConverter(theme.foreground).luminance >= 0.5;

const textForSolidBg = (theme, textToken, baseFallbackHex) => {
    const resolved = resolvePathOrRaw(theme, textToken);
    if (resolved) return resolved;
    if (!baseFallbackHex) {
        const { lightColor, darkColor } = contrastFromTheme(theme);
        return isForegroundLightGlobal(theme) ? darkColor : lightColor;
    }
    const f = colorConverter(baseFallbackHex);
    if (!f || typeof f.luminance !== "number") {
        const { lightColor, darkColor } = contrastFromTheme(theme);
        return isForegroundLightGlobal(theme) ? darkColor : lightColor;
    }
    const isLight = f.luminance >= 0.5;
    const { lightColor, darkColor } = contrastFromTheme(theme);
    return isLight ? darkColor : lightColor;
};

const isTransparentSurface = (v) => {
    if (v == null) return true;
    if (typeof v === "string" && v.trim().toLowerCase() === "transparent") return true;
    const f = colorConverter(v);
    if (!f) return true;
    const a = f.rgbaArray?.[3];
    if (typeof a === "number" && a < 0.02) return true;
    return false;
};

/**
 * Tüm default / hover / active yüzey + metin setleri. Icon, label vb. için toplu kullanılır.
 */
export const getButtonColorPalette = ({
    theme,
    primary,
    secondary,
    bgColor,
    color,
    hoverBgColor,
    activeBgColor,
    hoverColor,
    activeColor,
    pendingBgColor,
    pendingColor,
    alphaRate = 10,
    outlined = false,
}) => {
    const selectedBgColor = primary
        ? theme.primary
        : secondary
          ? theme.secondary
          : bgColor
            ? resolvePathOrRaw(theme, bgColor) || bgColor
            : theme.foreground || colorAlpha("black", 0.8);

    const bg1Formats = colorConverter(selectedBgColor);
    const selectedHex8 = bg1Formats.hex8;
    const luminance = bg1Formats.luminance;
    const isLight = luminance >= 0.5;

    const toneFn = isLight ? colorShader : colorTinter;
    const inverseToneFn = isLight ? colorTinter : colorShader;

    const hoverRate = getInteractiveRate(alphaRate, luminance, "hover");
    const activeRate = getInteractiveRate(alphaRate, luminance, "active");

    const resolvedHoverBg = resolvePathOrRaw(theme, hoverBgColor);
    const resolvedActiveBg = resolvePathOrRaw(theme, activeBgColor);
    const resolvedPendingBg = resolvePathOrRaw(theme, pendingBgColor);

    const normalBg1 = selectedHex8;
    const normalBg2 = resolvedHoverBg || toneFn(selectedHex8, hoverRate);
    const normalBg3 = resolvedActiveBg || toneFn(resolvedHoverBg || selectedHex8, activeRate);

    const inverse1 = inverseToneFn(selectedHex8, hoverRate);
    const inverse2 = inverseToneFn(selectedHex8, activeRate);

    if (outlined) {
        const overlayBase = isLight ? "#ffffff" : "#000000";
        const outlinedBg1 = "transparent";
        const outlinedBg2 = resolvedHoverBg || colorAlpha(overlayBase, hoverRate / 100);
        const outlinedBg3 = resolvedActiveBg || colorAlpha(overlayBase, activeRate / 100);
        const baseLabel = resolvePathOrRaw(theme, color) || selectedBgColor;

        return {
            default: {
                bg: outlinedBg1,
                color: resolvePathOrRaw(theme, color) || selectedBgColor,
            },
            hover: {
                bg: outlinedBg2,
                color:
                    resolvePathOrRaw(theme, hoverColor) || resolvePathOrRaw(theme, color) || baseLabel,
            },
            active: {
                bg: outlinedBg3,
                color:
                    resolvePathOrRaw(theme, activeColor) || resolvePathOrRaw(theme, color) || baseLabel,
            },
            pending: {
                bg: resolvedPendingBg || outlinedBg2,
                color:
                    resolvePathOrRaw(theme, pendingColor) ||
                    resolvePathOrRaw(theme, color) ||
                    baseLabel,
            },
            inverse1,
            inverse2,
        };
    }

    const pendingBgSolid = resolvedPendingBg || normalBg2;
    const resolvedTextColor = resolvePathOrRaw(theme, color);
    const textForSurface = (stateBg) =>
        resolvedTextColor || (isTransparentSurface(stateBg) ? "inherit" : textForSolidBg(theme, null, stateBg));

    return {
        default: {
            bg: normalBg1,
            color: textForSurface(normalBg1),
        },
        hover: {
            bg: normalBg2,
            color:
                resolvePathOrRaw(theme, hoverColor) || resolvedTextColor || textForSurface(normalBg2),
        },
        active: {
            bg: normalBg3,
            color:
                resolvePathOrRaw(theme, activeColor) ||
                resolvedTextColor ||
                textForSurface(normalBg3),
        },
        pending: {
            bg: pendingBgSolid,
            color:
                resolvePathOrRaw(theme, pendingColor) ||
                resolvedTextColor ||
                textForSurface(pendingBgSolid),
        },
        inverse1,
        inverse2,
    };
};

export const resolveButtonColors = ({
    theme,
    primary,
    secondary,
    bgColor,
    color,
    hoverBgColor,
    activeBgColor,
    hoverColor,
    activeColor,
    alphaRate = 10,
    outlined = false,
    isHovered,
    isActivated,
}) => {
    const palette = getButtonColorPalette({
        theme,
        primary,
        secondary,
        bgColor,
        color,
        hoverBgColor,
        activeBgColor,
        hoverColor,
        activeColor,
        alphaRate,
        outlined,
    });
    const interaction = isActivated ? "active" : isHovered ? "hover" : "default";
    const { bg, color: c } = palette[interaction];
    return {
        bg,
        color: c,
        inverse1: palette.inverse1,
        inverse2: palette.inverse2,
    };
};

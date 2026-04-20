import { colorConverter } from "../../colorConverter";
import { colorShader } from "../../colorShader";
import { colorAlpha } from "../../colorAlpha";
import { colorTinter } from "../../colorTinter";
import { byPath } from "../../byPath";

export const generateColors = ({
    theme,
    primary,
    secondary,
    bgColor,
    color,
    hoverBgColor,
    activeBgColor,
    alphaRate = 10,
    outlined = false,
}) => {
    const selectedBgColor = primary
        ? theme.primary
        : secondary
          ? theme.secondary
          : bgColor
            ? byPath.get(theme, bgColor) || theme[bgColor] || bgColor
            : theme.foreground || colorAlpha("black", 0.8);

    const bg1Formats = colorConverter(selectedBgColor);
    const selectedHex8 = bg1Formats.hex8;
    const luminance = bg1Formats.luminance;
    const isLight = luminance >= 0.5;

    const toneFn = isLight ? colorShader : colorTinter;
    const inverseToneFn = isLight ? colorTinter : colorShader;

    const getInteractiveRate = (baseRate, luminanceValue, type = "hover") => {
        if (typeof luminanceValue !== "number") {
            return type === "active" ? baseRate * 2 : baseRate;
        }

        const base = type === "active" ? baseRate * 2 : baseRate;
        const multiplier = luminanceValue < 0.5 ? 1 + (0.5 - luminanceValue) * 2.4 : 1;

        return Math.min(100, base * multiplier);
    };

    const hoverRate = getInteractiveRate(alphaRate, luminance, "hover");
    const activeRate = getInteractiveRate(alphaRate, luminance, "active");

    const resolvedHoverBg = hoverBgColor
        ? byPath.get(theme, hoverBgColor) || theme[hoverBgColor] || hoverBgColor
        : null;
    const resolvedActiveBg = activeBgColor
        ? byPath.get(theme, activeBgColor) || theme[activeBgColor] || activeBgColor
        : null;

    const normalBg1 = selectedHex8;
    const normalBg2 = resolvedHoverBg || toneFn(selectedHex8, hoverRate);
    const normalBg3 = resolvedActiveBg || toneFn(resolvedHoverBg || selectedHex8, activeRate);

    const inverse1 = inverseToneFn(selectedHex8, hoverRate);
    const inverse2 = inverseToneFn(selectedHex8, activeRate);

    const isForegroundLight = colorConverter(theme.foreground).luminance >= 0.5;
    const lightColor = isForegroundLight ? theme.foreground : theme.background;
    const darkColor = isForegroundLight ? theme.background : theme.foreground;
    const normalColor = color || (isLight ? darkColor : lightColor);

    if (outlined) {
        const overlayBase = isLight ? "#ffffff" : "#000000";
        const outlinedBg1 = "transparent";
        const outlinedBg2 = resolvedHoverBg || colorAlpha(overlayBase, hoverRate / 100);
        const outlinedBg3 = resolvedActiveBg || colorAlpha(overlayBase, activeRate / 100);
        const outlinedColor = color || selectedBgColor;

        console.log(hoverBgColor, resolvedHoverBg, outlinedBg1, outlinedBg2);
        return [outlinedBg1, outlinedBg2, outlinedBg3, outlinedColor, inverse1, inverse2];
    }

    return [normalBg1, normalBg2, normalBg3, normalColor, inverse1, inverse2];
};

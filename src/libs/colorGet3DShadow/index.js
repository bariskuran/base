import { css } from "styled-components";
import { baseStore } from "../@baseStore";
import { colorConverter } from "../colorConverter";

const getRgbString = (color) => {
    try {
        const rgb = colorConverter(color)?.rgbArray;
        if (rgb?.length >= 3) {
            return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
        }
    } catch {
        return "0, 0, 0";
    }

    return "0, 0, 0";
};

const buildShadowLayers = (depth = 1, rgb = "0, 0, 0") => {
    const d = depth * 2.5;

    return `
        0 ${d * 0.5}rem ${d * 1}rem rgba(${rgb}, 0.06),
        0 ${d * 1.5}rem ${d * 3}rem rgba(${rgb}, 0.08),
        0 ${d * 3}rem ${d * 6}rem rgba(${rgb}, 0.12)
    `;
};

// ${get3DShadow({ depth: 1, hoverDepth: 3 })}

export const get3DShadow = ({ depth = 1, hoverDepth = null, transition = true, color } = {}) => {
    const theme = baseStore.globalData.get().theme;
    const baseColor = color || theme?.foreground || "#000";
    const rgb = getRgbString(baseColor);

    return css`
        box-shadow: ${buildShadowLayers(depth, rgb)};
        ${transition ? `transition: box-shadow 0.25s ease;` : ""}

        ${hoverDepth != null
            ? `
            &:hover {
                box-shadow: ${buildShadowLayers(hoverDepth, rgb)};
            }
        `
            : ""}
    `;
};

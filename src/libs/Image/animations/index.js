import { css } from "styled-components";
import { pulse } from "./pulse";

const animations = {
    pulse: css`
        ${pulse} 1.15s ease-in-out infinite
    `,
    default: css`
        ${pulse} 1.15s ease-in-out infinite
    `,
};

export const getImageLoadingAnimation = (name) => {
    if (!name || name === "none") return "none";
    return animations[name] || animations.default;
};

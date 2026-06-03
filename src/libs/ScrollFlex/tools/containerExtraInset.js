import { CONTENT_SIZE_MEASURE_SLACK_PX } from "./constants";

export const getContainerExtraInsetPx = (axis, { barGutters, shellPaddingInsetsPx, containerBorderInsetsPx }) => {
    const gutter = axis === "x" ? barGutters.gutterX : barGutters.gutterY;
    const pad = axis === "x" ? shellPaddingInsetsPx.x : shellPaddingInsetsPx.y;
    const border = axis === "x" ? containerBorderInsetsPx.x : containerBorderInsetsPx.y;

    return gutter + pad + border + CONTENT_SIZE_MEASURE_SLACK_PX;
};

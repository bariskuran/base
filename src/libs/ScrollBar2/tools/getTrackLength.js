import { getViewport } from "./getViewport";

export const getTrackLength = ({
    mode,
    barPosition,
    source,
    body,
    maxLength,
    trackMargin,
    trackEl,
    overlayRect,
}) => {
    const isVertical = barPosition === "vertical";

    if (mode === "external") {
        const rect = trackEl?.getBoundingClientRect?.();
        const parentRect = trackEl?.parentElement?.getBoundingClientRect?.();
        const trackLength = isVertical ? rect?.height || 0 : rect?.width || 0;
        const parentLength = isVertical ? parentRect?.height || 0 : parentRect?.width || 0;

        return Math.max(0, trackLength || parentLength);
    }

    if (body) {
        const viewport = getViewport();
        const baseLength = isVertical ? viewport.height : viewport.width;

        return maxLength
            ? Math.max(0, baseLength * (maxLength / 100))
            : Math.max(0, baseLength - trackMargin * 2);
    }

    const baseLength = isVertical
        ? overlayRect?.height || source?.clientHeight || 0
        : overlayRect?.width || source?.clientWidth || 0;

    return maxLength
        ? Math.max(0, baseLength * (maxLength / 100))
        : Math.max(0, baseLength - trackMargin * 2);
};

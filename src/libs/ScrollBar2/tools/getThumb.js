import { clamp } from "./clamp";
import { getScrollMetrics } from "./getScrollMetrics";

export const getThumb = ({
    source,
    axis,
    body,
    trackLength,
    minThumbLength,
    exactThumbSize,
    fillMode,
}) => {
    const metrics = getScrollMetrics({
        source,
        axis,
        body,
    });

    if (!metrics.isOverflowing || trackLength <= 0) {
        return {
            ...metrics,
            thumbLength: 0,
            thumbPosition: 0,
            movable: 0,
        };
    }

    if (fillMode) {
        const progress = metrics.maxScroll > 0 ? metrics.scroll / metrics.maxScroll : 0;

        return {
            ...metrics,
            thumbLength: clamp(trackLength * progress, 0, trackLength),
            thumbPosition: 0,
            movable: trackLength,
        };
    }

    let thumbLength =
        exactThumbSize != null
            ? Number(exactThumbSize)
            : trackLength * (metrics.visible / metrics.content);

    if (!Number.isFinite(thumbLength)) thumbLength = minThumbLength;

    thumbLength = clamp(thumbLength, minThumbLength, trackLength);

    const movable = Math.max(0, trackLength - thumbLength);
    const thumbPosition =
        metrics.maxScroll > 0 && movable > 0 ? (metrics.scroll / metrics.maxScroll) * movable : 0;

    return {
        ...metrics,
        thumbLength,
        thumbPosition,
        movable,
    };
};

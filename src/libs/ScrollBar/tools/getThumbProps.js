const getSafeNumber = (value, fallback) => {
    if (value == null) return fallback;
    const n = Number(value);
    if (Number.isNaN(n)) return fallback;
    return n;
};

const getThumbProps = ({
    scrollAxis = "y",
    visualAxis = "y",
    maxLength,
    trackMargin,
    minThumbLength,
    exactThumbSize,
    fillMode = false,
    source = typeof window !== "undefined" ? window : undefined,
    visualSource = source,
} = {}) => {
    if (
        typeof window === "undefined" ||
        typeof document === "undefined" ||
        !source ||
        !visualSource
    ) {
        return {
            thumbLength: 0,
            thumbPosition: 0,
            trackLength: 0,
            maxScroll: 0,
            scrollPos: 0,
        };
    }

    const docEl = document.documentElement;
    const body = document.body;

    const isScrollY = scrollAxis === "y";
    const isVisualY = visualAxis === "y";

    const isWindowLike =
        source === window || source === document.body || source === document.documentElement;
    const isVisualWindowLike =
        visualSource === window ||
        visualSource === document.body ||
        visualSource === document.documentElement;

    const visibleLength = isWindowLike
        ? isScrollY
            ? window.innerHeight
            : window.innerWidth
        : isScrollY
          ? source.clientHeight
          : source.clientWidth;

    const visualHostLength = isVisualWindowLike
        ? isVisualY
            ? window.innerHeight
            : window.innerWidth
        : isVisualY
          ? visualSource.clientHeight
          : visualSource.clientWidth;

    const trackLength = Math.max(
        0,
        maxLength ? visualHostLength * (maxLength / 100) : visualHostLength - trackMargin * 2,
    );

    const contentLength = isWindowLike
        ? isScrollY
            ? Math.max(docEl.scrollHeight, body.scrollHeight)
            : Math.max(docEl.scrollWidth, body.scrollWidth)
        : isScrollY
          ? source.scrollHeight
          : source.scrollWidth;

    const scrollPos = isWindowLike
        ? isScrollY
            ? window.scrollY || window.pageYOffset || 0
            : window.scrollX || window.pageXOffset || 0
        : isScrollY
          ? source.scrollTop
          : source.scrollLeft;

    const maxScroll = Math.max(0, contentLength - visibleLength);

    if (maxScroll <= 0 || contentLength <= 0 || trackLength <= 0) {
        return {
            thumbLength: Math.round(trackLength),
            thumbPosition: 0,
            trackLength: Math.round(trackLength),
            maxScroll: 0,
            scrollPos: 0,
        };
    }

    if (fillMode) {
        const progress = Math.max(0, Math.min(1, scrollPos / maxScroll));
        const thumbLength = trackLength * progress;

        return {
            thumbLength: Math.round(thumbLength),
            thumbPosition: 0,
            trackLength: Math.round(trackLength),
            maxScroll: Math.round(maxScroll),
            scrollPos: Math.round(scrollPos),
        };
    }

    let thumbLength;

    if (exactThumbSize != null) {
        thumbLength = getSafeNumber(exactThumbSize, minThumbLength);
    } else {
        thumbLength = trackLength * (visibleLength / contentLength);
        thumbLength = Math.max(minThumbLength, thumbLength);
    }

    thumbLength = Math.max(1, thumbLength);
    thumbLength = Math.min(trackLength, thumbLength);

    const movableArea = Math.max(0, trackLength - thumbLength);
    const thumbPosition = maxScroll > 0 ? (scrollPos / maxScroll) * movableArea : 0;

    return {
        thumbLength: Math.round(thumbLength),
        thumbPosition: Math.round(thumbPosition),
        trackLength: Math.round(trackLength),
        maxScroll: Math.round(maxScroll),
        scrollPos: Math.round(scrollPos),
    };
};

export default getThumbProps;

const getThumbProps = ({
    direction = "x",
    defaultWidth = 10,
    defaultHeight = 96,
    minThumbLength = 24,
} = {}) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
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

    const isY = direction === "y";
    const longPercent = Math.max(defaultWidth, defaultHeight);
    const viewportLength = isY ? window.innerHeight : window.innerWidth;
    const trackLength = viewportLength * (longPercent / 100);

    const contentLength = isY
        ? Math.max(docEl.scrollHeight, body.scrollHeight)
        : Math.max(docEl.scrollWidth, body.scrollWidth);

    const visibleLength = isY ? window.innerHeight : window.innerWidth;

    const scrollPos = isY
        ? window.scrollY || window.pageYOffset || 0
        : window.scrollX || window.pageXOffset || 0;

    const maxScroll = Math.max(0, contentLength - visibleLength);

    if (maxScroll <= 0 || contentLength <= 0) {
        return {
            thumbLength: Math.round(trackLength),
            thumbPosition: 0,
            trackLength: Math.round(trackLength),
            maxScroll: 0,
            scrollPos: 0,
        };
    }

    let thumbLength = trackLength * (visibleLength / contentLength);
    thumbLength = Math.max(minThumbLength, thumbLength);
    thumbLength = Math.min(trackLength, thumbLength);
    const movableArea = trackLength - thumbLength;
    const thumbPosition = maxScroll > 0 ? (scrollPos / maxScroll) * movableArea : 0;

    return {
        thumbLength: Math.round(thumbLength),
        thumbPosition: Math.round(thumbPosition),
        maxScroll: Math.round(maxScroll),
        scrollPos: Math.round(scrollPos),
    };
};
export default getThumbProps;

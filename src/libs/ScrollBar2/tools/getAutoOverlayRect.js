export const getAutoOverlayRect = ({ source, overlayHost }) => {
    if (!source || !overlayHost) {
        return {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        };
    }

    const sourceRect = source.getBoundingClientRect();
    const hostRect = overlayHost.getBoundingClientRect();

    return {
        top: sourceRect.top - hostRect.top + overlayHost.scrollTop + source.clientTop,
        left: sourceRect.left - hostRect.left + overlayHost.scrollLeft + source.clientLeft,
        width: source.clientWidth,
        height: source.clientHeight,
    };
};

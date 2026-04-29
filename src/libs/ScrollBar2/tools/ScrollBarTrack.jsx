import { getViewport } from "./getViewport";

export const ScrollBarTrack = ({
    axis,
    barPosition,
    mode,
    body,
    source,
    overlayRect,
    Variant,
    trackRef,
    thumbRef,
    metrics,
    thickness,
    maxLength,
    trackMargin,
    edgeMargin,
    mirror,
    truckColor,
    thumbColor,
    enableThumbScale,
    disableOpacityEffect,
    isActive,
    isDragging,
    fillMode,
    zIndex,
    onTrackMouseDown,
    onThumbMouseDown,
    onMouseEnter,
    onMouseLeave,
}) => {
    const TrackComponent = Variant;
    const isVertical = barPosition === "vertical";
    const viewport = getViewport();

    const visualLength = isVertical
        ? body
            ? viewport.height
            : overlayRect?.height || source?.clientHeight || 0
        : body
          ? viewport.width
          : overlayRect?.width || source?.clientWidth || 0;

    const trackLength = maxLength
        ? Math.max(0, visualLength * (maxLength / 100))
        : Math.max(0, visualLength - trackMargin * 2);

    const trackStart = maxLength ? Math.max(0, (visualLength - trackLength) / 2) : trackMargin;

    let positionStyle = {};

    if (mode === "body") {
        positionStyle = isVertical
            ? {
                  position: "fixed",
                  top: trackStart,
                  [mirror ? "left" : "right"]: edgeMargin,
              }
            : {
                  position: "fixed",
                  left: trackStart,
                  [mirror ? "top" : "bottom"]: edgeMargin,
              };
    }

    if (mode === "auto") {
        positionStyle = isVertical
            ? {
                  position: "absolute",
                  top: trackStart,
                  [mirror ? "left" : "right"]: edgeMargin,
              }
            : {
                  position: "absolute",
                  left: trackStart,
                  [mirror ? "top" : "bottom"]: edgeMargin,
              };
    }

    if (mode === "external") {
        positionStyle = {
            position: "relative",
        };
    }

    const sizeStyle =
        mode === "external"
            ? isVertical
                ? {
                      width: `${thickness}rem`,
                      height: "100%",
                  }
                : {
                      width: "100%",
                      height: `${thickness}rem`,
                  }
            : isVertical
              ? {
                    width: `${thickness}rem`,
                    height: `${trackLength}px`,
                }
              : {
                    width: `${trackLength}px`,
                    height: `${thickness}rem`,
                };

    const thumbTransform = isVertical
        ? enableThumbScale
            ? `translate3d(0, ${fillMode ? 0 : metrics.thumbPosition}px, 0) scale(1.5, 1)`
            : `translate3d(0, ${fillMode ? 0 : metrics.thumbPosition}px, 0)`
        : enableThumbScale
          ? `translate3d(${fillMode ? 0 : metrics.thumbPosition}px, 0, 0) scale(1, 1.5)`
          : `translate3d(${fillMode ? 0 : metrics.thumbPosition}px, 0, 0)`;

    const thumbStyle = isVertical
        ? {
              width: "100%",
              height: `${metrics.thumbLength}px`,
              transform: thumbTransform,
              transformOrigin: "center top",
              cursor: fillMode ? "pointer" : isDragging ? "grabbing" : "grab",
          }
        : {
              height: "100%",
              width: `${metrics.thumbLength}px`,
              transform: thumbTransform,
              transformOrigin: "left center",
              cursor: fillMode ? "pointer" : isDragging ? "grabbing" : "grab",
          };

    return (
        <TrackComponent
            ref={trackRef}
            data-slot="track"
            data-axis={axis}
            data-bar-position={barPosition}
            $barPosition={barPosition}
            $truckColor={truckColor}
            $thumbColor={thumbColor}
            $isScrollbarActive={isActive}
            $isActive={isActive}
            $isDragging={isDragging}
            $mirror={mirror}
            $enableThumbScale={enableThumbScale}
            $disableOpacityEffect={disableOpacityEffect}
            onMouseDown={onTrackMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                ...positionStyle,
                ...sizeStyle,
                zIndex,
                display: metrics.isOverflowing ? "block" : "none",
                cursor: "pointer",
                pointerEvents: "auto",
                overflow: enableThumbScale ? "visible" : "hidden",
            }}
        >
            <div
                ref={thumbRef}
                data-slot="thumb"
                onMouseDown={fillMode ? undefined : onThumbMouseDown}
                style={thumbStyle}
            />
        </TrackComponent>
    );
};

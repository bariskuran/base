import S from "./_styled";
import useVars from "./useVars";

const Bar = ({
    Variant,
    truckRef,
    thumbRef,
    onTruckMouseDown,
    onThumbMouseDown,
    onMouseEnter,
    onMouseLeave,
    isDragging,
    isScrollbarActive,
    isWindowLike,
    hostRect,
    truckColor,
    thumbColor,
    colors,
    thickness,
    maxLength,
    trackMargin,
    edgeMargin,
    minThumbLength,
    exactThumbSize,
    fillMode,
    thumbLength,
    thumbPosition,
    barPosition,
    mirror,
}) => {
    const docEl = typeof document !== "undefined" ? document.documentElement : null;
    const viewportWidth =
        docEl?.clientWidth ?? (typeof window !== "undefined" ? window.innerWidth : 0);
    const viewportHeight =
        docEl?.clientHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0);

    const hostW = hostRect?.width || viewportWidth;
    const hostH = hostRect?.height || viewportHeight;

    const isBarVertical = barPosition === "vertical";

    const barLength = isBarVertical
        ? maxLength
            ? (hostH * maxLength) / 100
            : Math.max(0, hostH - trackMargin * 2)
        : maxLength
          ? (hostW * maxLength) / 100
          : Math.max(0, hostW - trackMargin * 2);

    const trackStartOffset = maxLength
        ? ((isBarVertical ? hostH : hostW) - barLength) / 2
        : trackMargin;

    const baseStyle = isBarVertical
        ? {
              width: thickness + "rem",
              height: `${barLength}px`,
          }
        : {
              width: `${barLength}px`,
              height: thickness + "rem",
          };

    const windowLikePositionStyle = isBarVertical
        ? {
              position: "fixed",
              top: trackStartOffset + "px",
              [mirror ? "left" : "right"]: edgeMargin + "rem",
          }
        : {
              position: "fixed",
              left: trackStartOffset + "px",
              [mirror ? "top" : "bottom"]: edgeMargin + "rem",
          };

    const hostLikePositionStyle = isBarVertical
        ? {
              position: "fixed",
              top: (hostRect?.top || 0) + trackStartOffset + "px",
              [mirror ? "left" : "right"]:
                  (mirror ? hostRect?.left || 0 : viewportWidth - (hostRect?.right || 0)) +
                  edgeMargin +
                  "px",
          }
        : {
              position: "fixed",
              left: (hostRect?.left || 0) + trackStartOffset + "px",
              [mirror ? "top" : "bottom"]:
                  (mirror ? hostRect?.top || 0 : viewportHeight - (hostRect?.bottom || 0)) +
                  edgeMargin +
                  "px",
          };

    const shouldUseMinThumb = exactThumbSize == null && !fillMode;

    return (
        <Variant
            ref={truckRef}
            onMouseDown={onTruckMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            $barPosition={barPosition}
            $mirror={mirror}
            $truckColor={truckColor}
            $thumbColor={thumbColor}
            $colors={colors}
            $thumbLength={thumbLength}
            $thumbPosition={thumbPosition}
            $isDragging={isDragging}
            $isScrollbarActive={isScrollbarActive}
            $isBoxMode={!isWindowLike}
            style={{
                ...baseStyle,
                ...(isWindowLike ? windowLikePositionStyle : hostLikePositionStyle),
                zIndex: 9999999999,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                cursor: "pointer",
                pointerEvents: "auto",
            }}
        >
            <div
                ref={thumbRef}
                onMouseDown={fillMode ? undefined : onThumbMouseDown}
                data-slot="thumb"
                style={
                    isBarVertical
                        ? {
                              width: "100%",
                              height: thumbLength + "px",
                              ...(shouldUseMinThumb ? { minHeight: minThumbLength + "px" } : {}),
                              cursor: fillMode ? "pointer" : isDragging ? "grabbing" : "grab",
                              transform: fillMode
                                  ? "translate3d(0, 0, 0) scale(1.5, 1)"
                                  : `translate3d(0, ${thumbPosition}px, 0) scale(1.5, 1)`,
                              transformOrigin: "center top",
                              willChange: "transform, height",
                          }
                        : {
                              height: "100%",
                              width: thumbLength + "px",
                              ...(shouldUseMinThumb ? { minWidth: minThumbLength + "px" } : {}),
                              cursor: fillMode ? "pointer" : isDragging ? "grabbing" : "grab",
                              transform: fillMode
                                  ? "translate3d(0, 0, 0) scale(1, 1.5)"
                                  : `translate3d(${thumbPosition}px, 0, 0) scale(1, 1.5)`,
                              transformOrigin: "left center",
                              willChange: "transform, width",
                          }
                }
            />
        </Variant>
    );
};

export const Base = (p) => {
    const {
        Variant,
        anchorRef,
        hostRect,
        isWindowLike,
        colors,
        truckColor,
        thumbColor,
        thickness,
        maxLength,
        trackMargin,
        edgeMargin,
        minThumbLength,
        exactThumbSize,
        fillMode,
        showX,
        showY,
        x,
        y,
        xTruckRef,
        yTruckRef,
        xThumbRef,
        yThumbRef,
        xBarPosition,
        yBarPosition,
        onXTruckMouseDown,
        onYTruckMouseDown,
        onXThumbMouseDown,
        onYThumbMouseDown,
        isDraggingX,
        isDraggingY,
        isScrollbarActive,
        handleOnMouseEnter,
        handleOnMouseLeave,
        mirror,
    } = useVars(p);

    return (
        <>
            <S.anchor ref={anchorRef} />

            {showY && (
                <Bar
                    Variant={Variant}
                    truckRef={yTruckRef}
                    thumbRef={yThumbRef}
                    onTruckMouseDown={onYTruckMouseDown}
                    onThumbMouseDown={onYThumbMouseDown}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                    isDragging={isDraggingY}
                    isScrollbarActive={isScrollbarActive}
                    isWindowLike={isWindowLike}
                    hostRect={hostRect}
                    truckColor={truckColor}
                    thumbColor={thumbColor}
                    colors={colors}
                    thickness={thickness}
                    maxLength={maxLength}
                    trackMargin={trackMargin}
                    edgeMargin={edgeMargin}
                    minThumbLength={minThumbLength}
                    exactThumbSize={exactThumbSize}
                    fillMode={fillMode}
                    thumbLength={y.thumbLength}
                    thumbPosition={y.thumbPosition}
                    barPosition={yBarPosition}
                    mirror={mirror}
                />
            )}

            {showX && (
                <Bar
                    Variant={Variant}
                    truckRef={xTruckRef}
                    thumbRef={xThumbRef}
                    onTruckMouseDown={onXTruckMouseDown}
                    onThumbMouseDown={onXThumbMouseDown}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                    isDragging={isDraggingX}
                    isScrollbarActive={isScrollbarActive}
                    isWindowLike={isWindowLike}
                    hostRect={hostRect}
                    truckColor={truckColor}
                    thumbColor={thumbColor}
                    colors={colors}
                    thickness={thickness}
                    maxLength={maxLength}
                    trackMargin={trackMargin}
                    edgeMargin={edgeMargin}
                    minThumbLength={minThumbLength}
                    exactThumbSize={exactThumbSize}
                    fillMode={fillMode}
                    thumbLength={x.thumbLength}
                    thumbPosition={x.thumbPosition}
                    barPosition={xBarPosition}
                    mirror={mirror}
                />
            )}
        </>
    );
};

import { createPortal } from "react-dom";
import S from "./_styled";
import useVars from "./useVars";
import { Visibility } from "../../Visibility";

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
    edgeMarginX,
    edgeMarginY,
    minThumbLength,
    exactThumbSize,
    fillMode,
    enableThumbScale,
    disableOpacityEffect,
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

    const hostW = hostRect?.clientWidth || hostRect?.width || viewportWidth;
    const hostH = hostRect?.clientHeight || hostRect?.height || viewportHeight;

    const isBarVertical = barPosition === "vertical";
    const resolvedEdgeMargin = isBarVertical ? edgeMarginY : edgeMarginX;

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
              [mirror ? "left" : "right"]: resolvedEdgeMargin + "rem",
          }
        : {
              position: "fixed",
              left: trackStartOffset + "px",
              [mirror ? "top" : "bottom"]: resolvedEdgeMargin + "rem",
          };

    const hostLikePositionStyle = isBarVertical
        ? {
              position: "absolute",
              top: trackStartOffset + "px",
              [mirror ? "left" : "right"]: resolvedEdgeMargin + "rem",
          }
        : {
              position: "absolute",
              left: trackStartOffset + "px",
              [mirror ? "top" : "bottom"]: resolvedEdgeMargin + "rem",
          };

    const shouldUseMinThumb = exactThumbSize == null && !fillMode;
    const verticalThumbTransform = enableThumbScale
        ? fillMode
            ? "translate3d(0, 0, 0) scale(1.5, 1)"
            : `translate3d(0, ${thumbPosition}px, 0) scale(1.5, 1)`
        : fillMode
          ? "translate3d(0, 0, 0)"
          : `translate3d(0, ${thumbPosition}px, 0)`;
    const horizontalThumbTransform = enableThumbScale
        ? fillMode
            ? "translate3d(0, 0, 0) scale(1, 1.5)"
            : `translate3d(${thumbPosition}px, 0, 0) scale(1, 1.5)`
        : fillMode
          ? "translate3d(0, 0, 0)"
          : `translate3d(${thumbPosition}px, 0, 0)`;

    return (
        <Variant
            aria-label="ScrollBar"
            ref={truckRef}
            onMouseDown={onTruckMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            data-slot="track"
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
            $enableThumbScale={enableThumbScale}
            $disableOpacityEffect={disableOpacityEffect}
            style={{
                ...baseStyle,
                ...(isWindowLike ? windowLikePositionStyle : hostLikePositionStyle),
                zIndex: 9999999999,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                cursor: "pointer",
                pointerEvents: "auto",
                overflow: enableThumbScale ? "visible" : "hidden",
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
                              transform: verticalThumbTransform,
                              transformOrigin: "center top",
                              willChange: "transform, height",
                          }
                        : {
                              height: "100%",
                              width: thumbLength + "px",
                              ...(shouldUseMinThumb ? { minWidth: minThumbLength + "px" } : {}),
                              cursor: fillMode ? "pointer" : isDragging ? "grabbing" : "grab",
                              transform: horizontalThumbTransform,
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
        overlayHost,
        hostRect,
        isWindowLike,
        colors,
        truckColor,
        thumbColor,
        thickness,
        maxLength,
        trackMargin,
        edgeMarginX,
        edgeMarginY,
        minThumbLength,
        exactThumbSize,
        fillMode,
        enableThumbScale,
        disableOpacityEffect,
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
        hasExternalSource,
        hasSplitPositionSource,
    } = useVars(p);

    const bars = [
        <Visibility.mount
            key="scrollbar-y"
            visible={showY}
            content={
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
                    edgeMarginX={edgeMarginX}
                    edgeMarginY={edgeMarginY}
                    minThumbLength={minThumbLength}
                    exactThumbSize={exactThumbSize}
                    fillMode={fillMode}
                    enableThumbScale={enableThumbScale}
                    disableOpacityEffect={disableOpacityEffect}
                    thumbLength={y.thumbLength}
                    thumbPosition={y.thumbPosition}
                    barPosition={yBarPosition}
                    mirror={mirror}
                />
            }
        />,
        <Visibility.mount
            key="scrollbar-x"
            visible={showX}
            content={
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
                    edgeMarginX={edgeMarginX}
                    edgeMarginY={edgeMarginY}
                    minThumbLength={minThumbLength}
                    exactThumbSize={exactThumbSize}
                    fillMode={fillMode}
                    enableThumbScale={enableThumbScale}
                    disableOpacityEffect={disableOpacityEffect}
                    thumbLength={x.thumbLength}
                    thumbPosition={x.thumbPosition}
                    barPosition={xBarPosition}
                    mirror={mirror}
                />
            }
        />,
    ];

    const overlay =
        !isWindowLike && (!hasExternalSource || hasSplitPositionSource) && overlayHost && hostRect
            ? createPortal(
                  <div
                      data-scrollbar-overlay=""
                      style={{
                          position: "absolute",
                          top: hostRect.overlayTop + "px",
                          left: hostRect.overlayLeft + "px",
                          width: (hostRect.clientWidth || hostRect.width || 0) + "px",
                          height: (hostRect.clientHeight || hostRect.height || 0) + "px",
                          overflow: "initial",
                          pointerEvents: "none",
                          zIndex: 9999999999,
                      }}
                  >
                      {bars}
                  </div>,
                  overlayHost,
              )
            : null;

    const barContent =
        isWindowLike || (hasExternalSource && !hasSplitPositionSource) ? bars : [overlay];

    return [<S.anchor key="scrollbar-anchor" ref={anchorRef} />, ...barContent];
};

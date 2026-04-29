import { createPortal } from "react-dom";
import S from "./_styled";
import useVars from "./useVars";
import { isBrowser } from "./isBrowser";
import { ScrollBarTrack } from "./ScrollBarTrack";

export const Base = (p) => {
    const {
        Variant,
        anchorRef,
        mode,
        body,
        source,
        overlayHost,
        overlayRect,
        disableX,
        disableY,
        x,
        y,
        xTrackRef,
        yTrackRef,
        xThumbRef,
        yThumbRef,
        xBarPosition,
        yBarPosition,
        truckColor,
        thumbColor,
        thickness,
        maxLength,
        trackMargin,
        edgeMargin,
        fillMode,
        enableThumbScale,
        disableOpacityEffect,
        mirror,
        zIndex,
        isDraggingX,
        isDraggingY,
        isScrollbarActive,
        activate,
        deactivateSoon,
        onXTrackMouseDown,
        onYTrackMouseDown,
        onXThumbMouseDown,
        onYThumbMouseDown,
    } = useVars(p);

    const bars = (
        <>
            {!disableY && (
                <ScrollBarTrack
                    axis="y"
                    barPosition={yBarPosition}
                    mode={mode}
                    body={body}
                    source={source}
                    overlayRect={overlayRect}
                    Variant={Variant}
                    trackRef={yTrackRef}
                    thumbRef={yThumbRef}
                    metrics={y}
                    thickness={thickness}
                    maxLength={maxLength}
                    trackMargin={trackMargin}
                    edgeMargin={edgeMargin}
                    mirror={mirror}
                    truckColor={truckColor}
                    thumbColor={thumbColor}
                    enableThumbScale={enableThumbScale}
                    disableOpacityEffect={disableOpacityEffect}
                    isActive={isScrollbarActive}
                    isDragging={isDraggingY}
                    fillMode={fillMode}
                    zIndex={zIndex}
                    onTrackMouseDown={onYTrackMouseDown}
                    onThumbMouseDown={onYThumbMouseDown}
                    onMouseEnter={activate}
                    onMouseLeave={deactivateSoon}
                />
            )}

            {!disableX && (
                <ScrollBarTrack
                    axis="x"
                    barPosition={xBarPosition}
                    mode={mode}
                    body={body}
                    source={source}
                    overlayRect={overlayRect}
                    Variant={Variant}
                    trackRef={xTrackRef}
                    thumbRef={xThumbRef}
                    metrics={x}
                    thickness={thickness}
                    maxLength={maxLength}
                    trackMargin={trackMargin}
                    edgeMargin={edgeMargin}
                    mirror={mirror}
                    truckColor={truckColor}
                    thumbColor={thumbColor}
                    enableThumbScale={enableThumbScale}
                    disableOpacityEffect={disableOpacityEffect}
                    isActive={isScrollbarActive}
                    isDragging={isDraggingX}
                    fillMode={fillMode}
                    zIndex={zIndex}
                    onTrackMouseDown={onXTrackMouseDown}
                    onThumbMouseDown={onXThumbMouseDown}
                    onMouseEnter={activate}
                    onMouseLeave={deactivateSoon}
                />
            )}
        </>
    );

    const overlay =
        mode === "auto" && overlayHost && overlayRect
            ? createPortal(
                  <div
                      data-scrollbar-overlay=""
                      style={{
                          position: "absolute",
                          top: `${overlayRect.top}px`,
                          left: `${overlayRect.left}px`,
                          width: `${overlayRect.width}px`,
                          height: `${overlayRect.height}px`,
                          overflow: "hidden",
                          pointerEvents: "none",
                          zIndex,
                      }}
                  >
                      {bars}
                  </div>,
                  overlayHost,
              )
            : null;

    const bodyPortal = mode === "body" && isBrowser() ? createPortal(bars, document.body) : null;

    return (
        <>
            <S.anchor ref={anchorRef} />
            {mode === "body" && bodyPortal}
            {mode === "external" && bars}
            {mode === "auto" && overlay}
        </>
    );
};

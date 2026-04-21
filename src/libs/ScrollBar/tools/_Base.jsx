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
    marginToSide,
    marginToBorder,
    minThumbLength,
    thumbLength,
    thumbPosition,
    isBarVertical,
    isOppositePosition,
}) => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    const baseStyle = isBarVertical
        ? {
              width: thickness + "rem",
              height: maxLength
                  ? `${((hostRect?.height || viewportHeight) * maxLength) / 100}px`
                  : `${Math.max(0, (hostRect?.height || viewportHeight) - marginToSide * 2)}px`,
          }
        : {
              width: maxLength
                  ? `${((hostRect?.width || viewportWidth) * maxLength) / 100}px`
                  : `${Math.max(0, (hostRect?.width || viewportWidth) - marginToSide * 2)}px`,
              height: thickness + "rem",
          };

    const windowLikePositionStyle = isBarVertical
        ? {
              position: "fixed",
              top: marginToSide + "px",
              [isOppositePosition ? "left" : "right"]: marginToBorder + "rem",
          }
        : {
              position: "fixed",
              left: marginToSide + "px",
              [isOppositePosition ? "top" : "bottom"]: marginToBorder + "rem",
          };

    const hostLikePositionStyle = isBarVertical
        ? {
              position: "fixed",
              top: (hostRect?.top || 0) + marginToSide + "px",
              [isOppositePosition ? "left" : "right"]:
                  (isOppositePosition
                      ? hostRect?.left || 0
                      : viewportWidth - (hostRect?.right || 0)) +
                  marginToBorder +
                  "px",
          }
        : {
              position: "fixed",
              left: (hostRect?.left || 0) + marginToSide + "px",
              [isOppositePosition ? "top" : "bottom"]:
                  (isOppositePosition
                      ? hostRect?.top || 0
                      : viewportHeight - (hostRect?.bottom || 0)) +
                  marginToBorder +
                  "px",
          };

    return (
        <Variant
            ref={truckRef}
            onMouseDown={onTruckMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            $barPosition={isBarVertical ? "vertical" : "horizontal"}
            $isOppositePosition={isOppositePosition}
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
                onMouseDown={onThumbMouseDown}
                data-slot="thumb"
                style={
                    isBarVertical
                        ? {
                              width: "100%",
                              height: thumbLength + "px",
                              minHeight: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                              transform: `translate3d(0, ${thumbPosition}px, 0) scale(1.5, 1)`,
                              transformOrigin: "center center",
                              willChange: "transform",
                          }
                        : {
                              height: "100%",
                              width: thumbLength + "px",
                              minWidth: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                              transform: `translate3d(${thumbPosition}px, 0, 0) scale(1, 1.5)`,
                              transformOrigin: "center center",
                              willChange: "transform",
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
        marginToSide,
        marginToBorder,
        minThumbLength,
        showX,
        showY,
        x,
        y,
        xTruckRef,
        yTruckRef,
        xThumbRef,
        yThumbRef,
        onXTruckMouseDown,
        onYTruckMouseDown,
        onXThumbMouseDown,
        onYThumbMouseDown,
        isDraggingX,
        isDraggingY,
        isScrollbarActive,
        handleOnMouseEnter,
        handleOnMouseLeave,
        xOnTop,
        yOnLeft,
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
                    marginToSide={marginToSide}
                    marginToBorder={marginToBorder}
                    minThumbLength={minThumbLength}
                    thumbLength={y.thumbLength}
                    thumbPosition={y.thumbPosition}
                    isBarVertical={true}
                    isOppositePosition={yOnLeft}
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
                    marginToSide={marginToSide}
                    marginToBorder={marginToBorder}
                    minThumbLength={minThumbLength}
                    thumbLength={x.thumbLength}
                    thumbPosition={x.thumbPosition}
                    isBarVertical={false}
                    isOppositePosition={xOnTop}
                />
            )}
        </>
    );
};

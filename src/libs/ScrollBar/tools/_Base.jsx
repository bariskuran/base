import useVars from "./useVars";

export const Base = (p) => {
    const {
        Variant,
        position,
        align,
        defaultWidth,
        defaultHeight,
        truckRef,
        direction,
        defaultSideMargin,
        colors,
        truckColor,
        thumbColor,
        thumbLength,
        thumbPosition,
        maxScroll,
        scrollPos,
        minThumbLength,
        isOverflowing,
        thumbRef,
        onTruckMouseDown,
        onThumbMouseDown,
        isDragging,
        isWindowLike,
        handleOnMouseEnter,
        isScrollbarActive,
        handleOnMouseLeave,
        defaultMargin,
    } = useVars(p);

    /* RETURN */
    if (!isOverflowing) return null;
    return (
        <Variant
            ref={truckRef}
            onMouseDown={onTruckMouseDown}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            //
            $position={position}
            $direction={direction}
            $align={align}
            $truckColor={truckColor}
            $thumbColor={thumbColor}
            $colors={colors}
            $thumbLength={thumbLength}
            $thumbPosition={thumbPosition}
            $maxScroll={maxScroll}
            $scrollPos={scrollPos}
            $isDragging={isDragging}
            $isScrollbarActive={isScrollbarActive}
            $isBoxMode={!isWindowLike}
            //
            style={{
                ...(position === "horizontal"
                    ? {
                          width: defaultHeight + "%",
                          height: defaultWidth + "rem",
                      }
                    : {
                          width: defaultWidth + "rem",
                          height: defaultHeight + "%",
                      }),
                [align]: defaultMargin + "rem",
                // [align]: 0 + "rem",
                //
                ...(!isWindowLike && position === "vertical"
                    ? { top: 0 }
                    : !isWindowLike && position === "horizontal"
                      ? { left: 0 }
                      : {}),
                [align === "top" || align === "bottom" ? "left" : "top"]: defaultSideMargin + "%",
                zIndex: 9999999999,
                position: isWindowLike ? "fixed" : "absolute",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                cursor: "pointer",
            }}
        >
            <div
                ref={thumbRef}
                onMouseDown={onThumbMouseDown}
                data-slot="thumb"
                style={
                    direction === "horizontal"
                        ? {
                              width: thumbLength + "px",
                              height: "150%",
                              translate: `${thumbPosition}px 0`,
                              transformOrigin: "right center",
                              minWidth: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                          }
                        : {
                              height: thumbLength + "px",
                              width: "150%",
                              translate: `0 ${thumbPosition}px`,
                              minHeight: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                          }
                }
            />
        </Variant>
    );
};

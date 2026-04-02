import useVars from "./useVars";

export const Base = (p) => {
    const {
        Variant,
        position,
        align,
        defaultWidth,
        defaultHeight,
        defaultMargin,
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
    } = useVars(p);

    /* RETURN */
    if (!isOverflowing) return null;
    return (
        <Variant
            ref={truckRef}
            onMouseDown={onTruckMouseDown}
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
                [align === "top" || align === "bottom" ? "left" : "top"]: defaultSideMargin + "%",
                zIndex: 99999999999999,
                position: "absolute",
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
                              height: "100%",
                              transform: `translateX(${thumbPosition}px)`,
                              minWidth: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                          }
                        : {
                              height: thumbLength + "px",
                              width: "100%",
                              transform: `translateY(${thumbPosition}px)`,
                              minHeight: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                          }
                }
            />
        </Variant>
    );
};

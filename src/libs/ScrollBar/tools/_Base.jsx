import useVars from "./useVars";

export const Base = (p) => {
    const {
        Variant,
        barPosition,
        isOppositePosition,
        truckRef,
        colors,
        truckColor,
        thumbColor,
        thumbLength,
        thumbPosition,
        maxScroll,
        scrollPos,
        isOverflowing,
        thumbRef,
        onTruckMouseDown,
        onThumbMouseDown,
        isDragging,
        isWindowLike,
        handleOnMouseEnter,
        isScrollbarActive,
        handleOnMouseLeave,
        thickness,
        maxLength,
        marginToSide,
        marginToBorder,
        minThumbLength,
        isBarVertical,
        mainKey,
        crossKey,
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
            $barPosition={barPosition}
            $isOppositePosition={isOppositePosition}
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
                ...(isBarVertical
                    ? {
                          width: thickness + "rem",
                          height: maxLength
                              ? maxLength + "%"
                              : `calc(100% - ${marginToSide}px * 2)`,
                      }
                    : {
                          width: maxLength ? maxLength + "%" : `calc(100% - ${marginToSide}px * 2)`,
                          height: thickness + "rem",
                      }),
                [mainKey]: marginToBorder + "rem",
                ...(!isWindowLike && isBarVertical ? { top: 0 } : {}),
                ...(!isWindowLike && !isBarVertical ? { left: 0 } : {}),
                [crossKey]: !maxLength ? marginToSide + "px" : (100 - maxLength) / 2 + "%",
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
                    isBarVertical
                        ? {
                              width: "100%",
                              height: thumbLength + "px",
                              scale: "1.5 1",
                              translate: `0 ${thumbPosition}px`,
                              minHeight: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                          }
                        : {
                              height: "100%",
                              width: thumbLength + "px",
                              scale: "1 1.5",
                              translate: `${thumbPosition}px 0`,
                              minWidth: minThumbLength + "px",
                              cursor: isDragging ? "grabbing" : "grab",
                          }
                }
            />
        </Variant>
    );
};

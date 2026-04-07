import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";
import { normalizeCssSize } from "../../normalizeCssSize";

export const Base = ({ children, ...p }) => {
    const {
        maxHeight,
        maxWidth,
        Variant,
        containerRef,
        disableBoxShadow,
        isOverflowingY,
        isOverflowingX,
        isOverflowing,
        fullWidth,
        scrollBarProps,
    } = useVars(p);

    return (
        <div
            style={{
                maxWidth: "100%",
                minWidth: 0,
                position: "relative",
            }}
        >
            <Variant
                ref={containerRef}
                //
                $maxHeight={normalizeCssSize(maxHeight)}
                $fullWidth={fullWidth}
                $disableBoxShadow={!isOverflowing ? false : disableBoxShadow}
                $isOverflowing={isOverflowing}
                $isOverflowingY={isOverflowingY}
                $isOverflowingX={isOverflowingX}
                //
                style={{
                    minWidth: 0,
                    ...(maxWidth ? { maxWidth: normalizeCssSize(maxWidth) } : {}),
                    ...(maxHeight ? { maxHeight: normalizeCssSize(maxHeight) } : {}),
                    ...(isOverflowingY && !fullWidth ? { paddingRight: 20 } : {}),
                    ...(isOverflowingX && !fullWidth ? { paddingBottom: 20 } : {}),
                    ...(fullWidth ? { width: "100%" } : {}),
                }}
            >
                {children}
            </Variant>
            <ScrollBar
                {...scrollBarProps}
                containerRef={containerRef}
                position={isOverflowingY ? "vertical" : "horizontal"}
                align={isOverflowingY ? "right" : "bottom"}
            />
        </div>
    );
};

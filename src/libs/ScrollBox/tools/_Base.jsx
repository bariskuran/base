import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";

export const Base = ({ children, ...p }) => {
    const {
        maxHeight,
        Variant,
        containerRef,
        disableBoxShadow,
        isOverflowing,
        fullWidth,
        scrollBarProps,
    } = useVars(p);

    /* RETURN */
    return (
        <Variant
            ref={containerRef}
            $maxHeight={maxHeight}
            $disableBoxShadow={disableBoxShadow}
            $isOverflowing={isOverflowing}
            $fullWidth={fullWidth}
        >
            <ScrollBar {...scrollBarProps} containerRef={containerRef} />
            {children}
        </Variant>
    );
};

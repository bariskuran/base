import { baseStore } from "../../@baseStore";
import { useRef } from "react";
import { useCheckOverflow } from "../../useCheckOverflow";
import { useExportData } from "../../useExportedData";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    const { Variant, maxHeight, disableBoxShadow, fullWidth, scrollBarProps } = p || {};

    /**
     *
     * Store
     **
     */
    const containerRef = useRef(null);
    const { isOverflowingY, isOverflowingX, isOverflowing } = useCheckOverflow({
        ref: containerRef,
    });
    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    /* Return */
    return useExportData(
        {
            ...p,
            theme,
            Variant,
            maxHeight,
            containerRef,
            disableBoxShadow,
            fullWidth,
            scrollBarProps,
        },
        {
            isOverflowingY,
            isOverflowingX,
            isOverflowing,
        },
    );
};
export default useVars;

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
    const { Variant, maxWidth, maxHeight, disableShadow, fullWidth, scrollBarProps, exportData } =
        p || {};

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
    const disableScrollBox = !maxHeight && !maxWidth;

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            theme,
            Variant,
            disableScrollBox,
            maxHeight,
            containerRef,
            disableShadow,
            fullWidth,
            maxWidth,
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

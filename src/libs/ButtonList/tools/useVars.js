import { useMemo } from "react";
import { deepMerge } from "../../deepMerge";
import { baseStore } from "../../@baseStore";
import { colorGet } from "../../colorGet";
import { useExportData } from "../../useExportedData";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    const {
        items,
        commonProps,
        direction = "column",
        gap = 5,
        bgColor,
        Variant,
        maxHeight,
        maxWidth,
        scrollBoxProps = {},
        exportData,
    } = p || {};

    /**
     *
     * States
     **
     */
    const [theme] = baseStore.useGlobal((s) => [s.theme]);
    const defaultBackgorund = theme?.background;
    const colors = colorGet(bgColor || defaultBackgorund);

    /**
     *
     * Vars
     **
     */
    const preparedItems = useMemo(
        () =>
            items.map((item) => {
                return deepMerge(commonProps, item);
            }),
        [items, commonProps],
    );

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            items,
            commonProps,
            direction,
            gap,
            colors: colors || {},
            Variant,
            scrollBoxProps: {
                ...scrollBoxProps,
                ...(maxHeight ? { maxHeight } : {}),
                ...(maxWidth ? { maxWidth } : {}),
            },
        },
        {
            preparedItems,
        },
    );
};
export default useVars;

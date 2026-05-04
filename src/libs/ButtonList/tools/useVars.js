import { useMemo, useRef } from "react";
import { deepMerge } from "../../deepMerge";
import { useExportData } from "../../useExportedData";

const useVars = (p = {}) => {
    const {
        Variant,
        forwardedRef,
        buttons = [],
        commonButtonProps = {},
        flexProps = {},
        scrollBarProps = {},
        exportData,
    } = p;

    const flexScrollRef = useRef(null);

    const preparedItems = useMemo(
        () => buttons.map((item) => deepMerge(commonButtonProps, item)),
        [buttons, commonButtonProps],
    );

    const resolvedFlexProps = useMemo(() => {
        const fp = flexProps || {};
        const out = { ...fp };
        if (out.width == null) out.width = "100%";
        return out;
    }, [flexProps]);

    const mergedScrollBarProps = useMemo(
        () => ({
            ...scrollBarProps,
            edgeMargin: scrollBarProps?.edgeMargin ?? -5,
            sourceByRef: scrollBarProps?.sourceByRef ?? flexScrollRef,
        }),
        [scrollBarProps],
    );

    return useExportData(
        {
            exportData,
            Variant,
            forwardedRef,
            flexScrollRef,
            resolvedFlexProps,
            mergedScrollBarProps,
            buttons,
            commonButtonProps,
        },
        {
            preparedItems,
        },
    );
};

export default useVars;

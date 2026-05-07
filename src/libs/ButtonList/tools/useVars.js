import { useMemo } from "react";
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
        scrollFlexVariant,
        exportData,
    } = p;

    const preparedItems = useMemo(
        () => buttons.map((item) => deepMerge(commonButtonProps, item)),
        [buttons, commonButtonProps],
    );

    const resolvedFlexProps = useMemo(() => ({ ...(flexProps || {}) }), [flexProps]);

    const mergedScrollBarProps = useMemo(
        () => ({
            ...scrollBarProps,
            edgeMargin: scrollBarProps?.edgeMargin ?? -5,
        }),
        [scrollBarProps],
    );

    return useExportData(
        {
            exportData,
            Variant,
            forwardedRef,
            resolvedFlexProps,
            mergedScrollBarProps,
            scrollFlexVariant,
            buttons,
            commonButtonProps,
        },
        {
            preparedItems,
        },
    );
};

export default useVars;

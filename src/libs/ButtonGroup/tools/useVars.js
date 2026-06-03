import { useMemo } from "react";
import { useExportData } from "helpers/useExportedData";
import { useScrollEdgeShadow } from "./useScrollEdgeShadow";

const useVars = (p = {}) => {
    const {
        Variant,
        forwardedRef,
        items = [],
        groupProps = {},
        flexProps = {},
        scrollBarProps = {},
        scrollFlexVariant,
        exportData,
        flat = false,
        scrollEdgeShadow = false,
    } = p;

    const resolvedFlexProps = useMemo(() => ({ ...(flexProps || {}) }), [flexProps]);

    const isRowLayout = useMemo(() => {
        const d = resolvedFlexProps?.direction;
        if (d == null) return true;
        const s = String(d).toLowerCase();
        return !(s === "column" || s === "column-reverse" || s === "y" || s === "y-reverse");
    }, [resolvedFlexProps]);

    const { scrollBarPropsWithEdgeShadow } = useScrollEdgeShadow({
        enabled: scrollEdgeShadow && !flat,
        isRowLayout,
        scrollBarProps,
        scrollEdgeWrapRef: p.scrollEdgeWrapRef,
    });

    return useExportData(
        {
            exportData,
            Variant,
            forwardedRef,
            items,
            groupProps,
            resolvedFlexProps,
            mergedScrollBarProps: scrollBarPropsWithEdgeShadow,
            scrollFlexVariant,
            flat,
            scrollEdgeShadow: scrollEdgeShadow && !flat,
        },
        {
            isRowLayout,
        },
    );
};

export default useVars;

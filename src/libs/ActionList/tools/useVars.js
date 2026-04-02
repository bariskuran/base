import { useMemo } from "react";
import { deepMerge } from "../../deepMerge";
import { baseStore } from "../../@baseStore";
import { colorGet } from "../../colorGet";

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
        disableBoxShadow,
        scrollBoxProps,
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
    return {
        ...p,
        items,
        commonProps,
        direction,
        preparedItems,
        gap,
        colors: colors || {},
        disableBoxShadow,
        scrollBoxProps,
    };
};
export default useVars;

import { baseStore } from "../../@baseStore";
import { DefaultVariant } from "../DefaultVariant";
import { useRef } from "react";
import { useCheckOverflow } from "../../useCheckOverflow";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    const { variant, maxHeight, disableBoxShadow, fullWidth, scrollBarProps } = p || {};

    /**
     *
     * Store
     **
     */
    const containerRef = useRef(null);
    const { isOverflowingY, isOverflowingX, isOverflowing } = useCheckOverflow({
        ref: containerRef,
    });
    const [theme, defaultVariants] = baseStore.useGlobal((s) => [s.theme, s.defaultVariants]);
    // const { setLocal } = baseStore.useLocal({});

    /**
     *
     * Functions
     **
     */

    /**
     *
     * Vars
     **
     */
    const Variant = variant || defaultVariants?.scrollBox || DefaultVariant;

    /* Return */
    return {
        ...p,
        theme,
        Variant,
        maxHeight,
        containerRef,
        isOverflowingY,
        isOverflowingX,
        disableBoxShadow,
        isOverflowing,
        fullWidth,
        scrollBarProps,
    };
};
export default useVars;

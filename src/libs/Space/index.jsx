import { useMemo } from "react";
import S from "./_styled";
import { cssNormalizeSize } from "../cssNormalizeSize";

export const Space = ({ size }) => {
    const $size = useMemo(() => {
        const sizes = {
            xs: 4,
            s: 8,
            m: 12,
            l: 16,
            xl: 24,
            xxl: 36,
            xxxl: 48,
            xxxxl: 64,
        };
        return cssNormalizeSize(sizes[size]) || cssNormalizeSize(size) || sizes.m;
    }, [size]);

    /* Return */
    if (!$size) return null;
    return <S.container $size={$size} aria-label="Space" />;
};

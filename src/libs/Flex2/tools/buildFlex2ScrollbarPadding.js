import { getNumber } from "./getNumber";

/** thickness ile aynı ölçek (sayısal rem birimi); ray kalınlığına ek kabuk boşluğu. */
const EXTRA_SCROLL_SHELL_PADDING = 4;

/**
 * ScrollBar export'taki top/right/bottom/left ile birebir: yalnızca gerçekten görünen rayın olduğu kenarda yer açılır.
 * Miktar: thickness + EXTRA_SCROLL_SHELL_PADDING.
 *
 * @param {object} exportedData — useExportedData birleşimi (ScrollBar'ın export ettiği top/left/thickness vb.)
 * @param {object} scrollBarProps — Flex props.scrollBarProps; exported üzerine yazar (edgeMargin/thickness vb.)
 */
export const buildFlex2ScrollbarPadding = (exportedData = {}, scrollBarProps = {}) => {
    const sb = { ...exportedData, ...scrollBarProps };

    const body = sb.body ?? false;

    const thicknessRaw = sb.thickness != null ? sb.thickness : 4;

    const thickness = getNumber(thicknessRaw, 0);

    const extraPaddingValue = thickness + EXTRA_SCROLL_SHELL_PADDING;

    const top = !!sb.top;
    const right = !!sb.right;
    const bottom = !!sb.bottom;
    const left = !!sb.left;

    if (body || extraPaddingValue <= 0 || (!top && !right && !bottom && !left)) {
        return {
            extraPaddingValue,
            top,
            left,
            bottom,
            right,
            containerPaddingTop: undefined,
            containerPaddingRight: undefined,
            containerPaddingBottom: undefined,
            containerPaddingLeft: undefined,
        };
    }

    const rem = `${extraPaddingValue}rem`;

    return {
        extraPaddingValue,
        top,
        left,
        bottom,
        right,
        containerPaddingTop: top ? rem : undefined,
        containerPaddingRight: right ? rem : undefined,
        containerPaddingBottom: bottom ? rem : undefined,
        containerPaddingLeft: left ? rem : undefined,
    };
};

import S from "./_styled";
import useVars from "./useVars";

export const Base = ({ children, content, contentArray, ...p }) => {
    const vars = useVars({ children, content, ...p });

    /* RETURN */
    if (!content && !children && (!contentArray || contentArray.length === 0)) return null;
    return (
        <S.container
            ref={vars.ref}
            as={vars.as}
            //
            $maxWidth={vars.maxWidth}
            $width={vars.width}
            $size={vars.size}
            $weight={vars.weight}
            $color={vars.color}
            $highlight={vars.highlight}
            $clamp={vars.clamp}
            $align={vars.align}
            $ellipsis={vars.ellipsis}
            $wrap={vars.wrap}
            $whiteSpace={vars.whiteSpace}
            $overflow={vars.overflow}
            $letterSpacing={vars.letterSpacing}
            $lineHeight={vars.lineHeight}
            $selectable={vars.selectable}
            $copyable={vars.copyable}
            $italic={vars.italic}
            $bold={vars.bold}
            $underline={vars.underline}
            $strikethrough={vars.strikethrough}
            $superscript={vars.superscript}
            $transform={vars.transform}
            $disabled={vars.disabled}
            $selfAlign={vars.selfAlign}
        >
            {vars.truncatedContent ?? children ?? content}
        </S.container>
    );
};

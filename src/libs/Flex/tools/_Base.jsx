import { Children } from "react";
import { S } from "./_styled.js";
import { useVars } from "./useVars.js";

export const Base = ({ children, content, className, style, forwardedRef, ...props }) => {
    const childrenCount = Children.count(children || content);
    const {
        bgColor,
        color,
        borderRadius,
        direction,
        padding,
        margin,
        width,
        height,
        flex,
        minHeight,
        minWidth,
        justifyContent,
        alignItems,
        gap,
        alignSelf,
        inProps,
        overflow,
        wrap,
    } = useVars({ props, childrenCount });

    /* RETURN */
    return (
        <S.container
            ref={forwardedRef}
            className={className}
            style={style}
            $bgColor={bgColor}
            $color={color}
            $borderRadius={borderRadius}
            $direction={direction}
            $padding={padding}
            $margin={margin}
            $width={width}
            $height={height}
            $justifyContent={justifyContent}
            $alignItems={alignItems}
            $gap={gap}
            $alignSelf={alignSelf}
            $inProps={inProps}
            $flex={flex}
            $minHeight={minHeight}
            $minWidth={minWidth}
            $overflow={overflow}
            $wrap={wrap}
        >
            {children ?? content}
        </S.container>
    );
};

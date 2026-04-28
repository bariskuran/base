import { Children } from "react";
import { S } from "./_styled.js";
import { useVars } from "./useVars.js";
import { getFlexDomRestProps } from "./getFlexDomRestProps.js";

export const Base = ({
    children,
    content,
    className,
    style,
    forwardedRef,
    Variant: _variant,
    __hasParentUiComponent: _hasParentUiComponent,
    ...props
}) => {
    const childrenCount = Children.count(children || content);
    const domRest = getFlexDomRestProps(props);
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
        flexFlow,
        flexGrow,
        flexShrink,
        flexBasis,
        order,
        minHeight,
        minWidth,
        justifyContent,
        alignItems,
        alignContent,
        gap,
        rowGap,
        columnGap,
        alignSelf,
        placeContent,
        placeItems,
        placeSelf,
        inProps,
        overflow,
        overflowX,
        overflowY,
        wrap,
    } = useVars({ props, childrenCount });

    /* RETURN */
    return (
        <S.container
            ref={forwardedRef}
            className={className}
            style={style}
            {...domRest}
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
            $flexFlow={flexFlow}
            $flexGrow={flexGrow}
            $flexShrink={flexShrink}
            $flexBasis={flexBasis}
            $order={order}
            $minHeight={minHeight}
            $minWidth={minWidth}
            $overflow={overflow}
            $overflowX={overflowX}
            $overflowY={overflowY}
            $alignContent={alignContent}
            $placeContent={placeContent}
            $placeItems={placeItems}
            $placeSelf={placeSelf}
            $wrap={wrap}
            $rowGap={rowGap}
            $columnGap={columnGap}
        >
            {children ?? content}
        </S.container>
    );
};

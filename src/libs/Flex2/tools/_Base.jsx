import { Children } from "react";
import { S } from "./_styled.js";
import { useVars } from "./useVars.js";
// import { getFlexDomRestProps } from "./getFlexDomRestProps.js";
import { ScrollBar } from "../../ScrollBar";

export const Base = ({
    children,
    content,
    className,
    style,
    forwardedRef,
    contentRef,
    Variant: _variant,
    __hasParentUiComponent: _hasParentUiComponent,
    ...props
}) => {
    // const domRest = getFlexDomRestProps(props);
    const { exportDataForScrollBar, scrollBarProps, width, height, direction, gap } = useVars({
        props,
    });

    /* RETURN */
    return (
        <S.container $width={width} $height={height} $direction={direction} $gap={gap}>
            <S.content ref={contentRef}>{children ?? content}</S.content>
            <ScrollBar
                exportData={exportDataForScrollBar}
                {...scrollBarProps}
                sourceByRef={contentRef}
            />
        </S.container>
    );
};

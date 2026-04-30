import { S, toTransientFlexContentProps } from "./_styled.js";
import { useVars } from "./useVars.js";
import { ScrollBar } from "../../ScrollBar";

const Render = ({
    className,
    forwardedRef,
    children,
    content,
    domRestProps,
    contentRef,
    containerSizingProps,
    contentStyleProps,
    containerStyle,
    contentStyle,
    calculatedValues,
    hasExplicitShellHeight,
    exportDataForScrollBar,
    scrollBarProps,
}) => (
    <S.container
        aria-label="Flex container"
        ref={forwardedRef}
        className={className}
        style={containerStyle}
        {...domRestProps}
        $hasExplicitShellHeight={hasExplicitShellHeight}
        $width={containerSizingProps.width}
        $height={containerSizingProps.height}
        $minWidth={containerSizingProps.minWidth}
        $minHeight={containerSizingProps.minHeight}
        $maxWidth={containerSizingProps.maxWidth}
        $maxHeight={containerSizingProps.maxHeight}
        $overflow={containerSizingProps.overflow}
        $overflowX={containerSizingProps.overflowX}
        $overflowY={containerSizingProps.overflowY}
        $flex={containerSizingProps.flex}
        $flexGrow={containerSizingProps.flexGrow}
        $flexShrink={containerSizingProps.flexShrink}
        $flexBasis={containerSizingProps.flexBasis}
        $alignSelf={containerSizingProps.alignSelf}
        $order={containerSizingProps.order}
        $paddingTop={calculatedValues.containerPaddingTop}
        $paddingRight={calculatedValues.containerPaddingRight}
        $paddingBottom={calculatedValues.containerPaddingBottom}
        $paddingLeft={calculatedValues.containerPaddingLeft}
    >
        <S.content
            aria-label="Flex content"
            ref={contentRef}
            style={contentStyle}
            $hasExplicitShellHeight={hasExplicitShellHeight}
            {...toTransientFlexContentProps(contentStyleProps)}
        >
            {children ?? content}
        </S.content>
        <ScrollBar
            {...scrollBarProps}
            exportData={exportDataForScrollBar}
            sourceByRef={contentRef}
        />
    </S.container>
);

export const Base = ({
    children,
    content,
    className,
    style,
    forwardedRef,
    Variant: _variant,
    __hasParentUiComponent: _hasParentUiComponent,
    ...props
}) => (
    <Render
        {...useVars({
            props,
            children,
            content,
            className,
            style,
            forwardedRef,
        })}
    />
);

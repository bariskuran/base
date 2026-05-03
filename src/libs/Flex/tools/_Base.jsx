import { Typo } from "../../Typo";
import { S, toTransientFlexContentProps } from "./_styled.js";
import { useVars } from "./useVars.js";
import { ScrollBar } from "../../ScrollBar";

const assignRef = (ref, value) => {
    if (!ref) return;
    if (typeof ref === "function") {
        ref(value);
        return;
    }
    ref.current = value;
};

const mergeRefs =
    (...refs) =>
    (value) => {
        refs.forEach((ref) => assignRef(ref, value));
    };

const FlexContentInner = ({ typographyWrap, mergedFlexChildren }) => {
    if (typographyWrap == null) return mergedFlexChildren;

    const SubTypo = Typo[typographyWrap.variantKey];
    const Comp = SubTypo != null ? SubTypo : Typo.span;

    return <Comp {...typographyWrap.typoProps}>{mergedFlexChildren}</Comp>;
};

const Render = ({
    className,
    forwardedRef,
    children: _children,
    content: _content,
    domRestProps,
    contentRef,
    containerRef,
    containerSizingProps,
    contentStyleProps,
    containerStyle,
    contentStyle,
    calculatedValues,
    hasExplicitShellHeight,
    exportDataForScrollBar,
    disableScrollBar,
    scrollBarProps,
    flexAriaLabels,
    mergedFlexChildren,
    typographyWrap,
}) => {
    const isWidth100Percent =
        typeof containerSizingProps.width === "string" &&
        containerSizingProps.width.trim() === "100%";

    const sb = scrollBarProps || {};
    const {
        edgeMargin: sbEdge,
        edgeMarginX: sbEdgeX,
        edgeMarginY: sbEdgeY,
        trackMargin: sbTrack,
        sourceByRef: _sbSrc,
        positionSourceByRef: _sbPos,
        exportData: _sbExp,
        ...sbRest
    } = sb;
    const flexScrollBarProps = {
        ...sbRest,
        trackMargin: sbTrack ?? 0,
        edgeMarginX: sbEdgeX ?? sbEdge ?? -7,
        edgeMarginY: sbEdgeY ?? sbEdge ?? (isWidth100Percent ? 0 : -7),
        exportData: exportDataForScrollBar,
        sourceByRef: contentRef,
        positionSourceByRef: containerRef,
    };

    return (
        <S.container
            aria-label={flexAriaLabels.container}
            ref={mergeRefs(forwardedRef, containerRef)}
            className={className}
            style={containerStyle}
            $calculatedValue={calculatedValues}
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
            $shellOverflowLocked={!disableScrollBar}
            $flex={containerSizingProps.flex}
            $flexGrow={containerSizingProps.flexGrow}
            $flexShrink={containerSizingProps.flexShrink}
            $flexBasis={containerSizingProps.flexBasis}
            $alignSelf={containerSizingProps.alignSelf}
            $justifySelf={containerSizingProps.justifySelf}
            $placeSelf={containerSizingProps.placeSelf}
            $order={containerSizingProps.order}
            $paddingTop={calculatedValues.containerPaddingTop}
            $paddingRight={isWidth100Percent ? undefined : calculatedValues.containerPaddingRight}
            $paddingBottom={calculatedValues.containerPaddingBottom}
            $paddingLeft={isWidth100Percent ? undefined : calculatedValues.containerPaddingLeft}
        >
            <S.content
                aria-label={flexAriaLabels.content}
                ref={contentRef}
                style={contentStyle}
                $shellScrollCapture={!disableScrollBar}
                {...toTransientFlexContentProps(contentStyleProps)}
            >
                <FlexContentInner
                    typographyWrap={typographyWrap}
                    mergedFlexChildren={mergedFlexChildren}
                />
            </S.content>
            {!disableScrollBar && <ScrollBar {...flexScrollBarProps} />}
        </S.container>
    );
};

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

import { Typo } from "../../Typo";
import { S, toTransientFlexContentProps } from "./_styled.js";
import { useVars } from "./useVars.js";

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
    rootRef,
    transientTreeProps,
    rootStyle,
    hasExplicitHeight,
    flexAriaLabel,
    mergedFlexChildren,
    typographyWrap,
}) => (
    <S.root
        ref={mergeRefs(forwardedRef, rootRef)}
        className={className}
        style={rootStyle}
        $hasExplicitHeight={hasExplicitHeight}
        {...toTransientFlexContentProps(transientTreeProps)}
        {...domRestProps}
        aria-label={flexAriaLabel}
    >
        <FlexContentInner typographyWrap={typographyWrap} mergedFlexChildren={mergedFlexChildren} />
    </S.root>
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

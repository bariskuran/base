import useVars from "./useVars";
import { Button } from "../../Button";
import { Flex } from "../../Flex";
import { ScrollFlex } from "../../ScrollFlex";

const rowClampGridStyle = {
    display: "grid",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    gridTemplateColumns: "minmax(0, 1fr)",
};

export const Base = (p = {}) => {
    const {
        Variant,
        forwardedRef,
        resolvedFlexProps,
        mergedScrollBarProps,
        scrollFlexVariant,
        preparedItems,
        isRowLayout,
        flat,
    } = useVars(p);

    const userStyle = p.style;
    const variantStyle = isRowLayout
        ? { width: "100%", maxWidth: "100%", minWidth: 0, ...(userStyle || {}) }
        : userStyle;

    const buttonNodes = preparedItems.map((item, i) => <Button key={i} {...item} />);

    /** No ScrollFlex; plain Flex keeps flexProps without a scroll container. */
    const listInner = flat ? (
        <Flex {...resolvedFlexProps} full>
            {buttonNodes}
        </Flex>
    ) : (
        <ScrollFlex
            {...(scrollFlexVariant != null ? { variant: scrollFlexVariant } : {})}
            flexProps={resolvedFlexProps}
            scrollBarProps={mergedScrollBarProps}
        >
            {buttonNodes}
        </ScrollFlex>
    );

    return (
        <Variant ref={forwardedRef} style={variantStyle}>
            {isRowLayout ? <div style={rowClampGridStyle}>{listInner}</div> : listInner}
        </Variant>
    );
};

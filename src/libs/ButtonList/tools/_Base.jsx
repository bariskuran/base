import useVars from "./useVars";
import { Button } from "../../Button";
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
    } = useVars(p);

    const userStyle = p.style;
    const variantStyle =
        isRowLayout ?
            { width: "100%", maxWidth: "100%", minWidth: 0, ...(userStyle || {}) }
        :   userStyle;

    const scrollFlexInner = (
        <ScrollFlex
            {...(scrollFlexVariant != null ? { variant: scrollFlexVariant } : {})}
            flexProps={resolvedFlexProps}
            scrollBarProps={mergedScrollBarProps}
        >
            {preparedItems.map((item, i) => (
                <Button key={i} {...item} />
            ))}
        </ScrollFlex>
    );

    return (
        <Variant ref={forwardedRef} style={variantStyle}>
            {isRowLayout ?
                <div style={rowClampGridStyle}>{scrollFlexInner}</div>
            :   scrollFlexInner}
        </Variant>
    );
};

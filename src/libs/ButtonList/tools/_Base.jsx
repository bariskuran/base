import useVars from "./useVars";
import { Button } from "../../Button";
import { ScrollFlex } from "../../ScrollFlex";

export const Base = (p = {}) => {
    const {
        Variant,
        forwardedRef,
        resolvedFlexProps,
        mergedScrollBarProps,
        scrollFlexVariant,
        preparedItems,
    } = useVars(p);

    return (
        <Variant ref={forwardedRef}>
            <ScrollFlex
                {...(scrollFlexVariant != null ? { variant: scrollFlexVariant } : {})}
                flexProps={resolvedFlexProps}
                scrollBarProps={mergedScrollBarProps}
            >
                {preparedItems.map((item, i) => (
                    <Button key={i} {...item} />
                ))}
            </ScrollFlex>
        </Variant>
    );
};

import useVars from "./useVars";
import { Button } from "../../Button";
import { ScrollFlex } from "../../ScrollFlex";

export const Base = (p = {}) => {
    const { direction, preparedItems, gap, colors, Variant, scrollFlexProps } = useVars(p);

    /* RETURN */
    return (
        <ScrollFlex {...scrollFlexProps}>
            <Variant $direction={direction} $gap={gap} $colors={colors}>
                {preparedItems.map((item, i) => (
                    <Button key={i} {...item} />
                ))}
            </Variant>
        </ScrollFlex>
    );
};

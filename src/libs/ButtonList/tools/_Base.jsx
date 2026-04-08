import useVars from "./useVars";
import { Button } from "../../Button";
import { ScrollBox } from "../../ScrollBox";

export const Base = (p = {}) => {
    const { direction, preparedItems, gap, colors, Variant, scrollBoxProps } = useVars(p);

    /* RETURN */
    return (
        <ScrollBox {...scrollBoxProps}>
            <Variant $direction={direction} $gap={gap} $colors={colors}>
                {preparedItems.map((item, i) => (
                    <Button key={i} {...item} />
                ))}
            </Variant>
        </ScrollBox>
    );
};

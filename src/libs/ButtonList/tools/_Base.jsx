import useVars from "./useVars";
import { Button } from "../../Button";

export const Base = (p = {}) => {
    const { direction, preparedItems, gap, colors, Variant } = useVars(p);

    /* RETURN */
    return (
        <Variant $direction={direction} $gap={gap} $colors={colors}>
            {preparedItems.map((item, i) => (
                <Button key={i} {...item} />
            ))}
        </Variant>
    );
};

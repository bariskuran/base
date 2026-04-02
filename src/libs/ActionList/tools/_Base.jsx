import useVars from "./useVars";
import { Button } from "../../Button";
import { ScrollBox } from "../../ScrollBox";
import S from "./_styled";

export const Base = (p = {}) => {
    const {
        direction,
        preparedItems,
        gap,
        colors,
        disableBoxShadow,
        scrollBoxProps,
        disableHover,
    } = useVars(p);

    /* RETURN */
    return (
        <ScrollBox {...scrollBoxProps} disableBoxShadow={disableBoxShadow}>
            <S.container
                $direction={direction}
                $gap={gap}
                $colors={colors}
                $disableBoxShadow={disableBoxShadow}
                $disableHover={disableHover}
            >
                {preparedItems.map((item, i) => (
                    <Button key={i} {...item} />
                ))}
            </S.container>
        </ScrollBox>
    );
};

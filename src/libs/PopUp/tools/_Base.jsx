import useVars from "./useVars";
import { PopOver } from "../../PopOver";
import { Flex } from "../../Flex";
import { Button } from "../../Button";

export const Base = (p) => {
    const {} = useVars(p);

    /* Return */
    return (
        <S.popUp>
            <Flex gap={12} padding={5} full wrap>
                <Flex full>{popUpContent}</Flex>
                <Flex full xAlign="end" wrap>
                    <Button {...cancelButtonProps} />
                    <Button {...confirmButtonProps} />
                </Flex>
            </Flex>
        </S.popUp>
    );
};

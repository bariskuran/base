import useVars from "./useVars";
import { PopOver } from "../../PopOver";
import { Flex } from "../../Flex";
import { Button } from "../../Button";

export const Base = (p) => {
    const { confirmButtonProps, cancelButtonProps, confirmationContent, popOverProps } = useVars(p);

    /* Return */
    return (
        <PopOver {...popOverProps}>
            <Flex gap={12} padding={5} full wrap>
                <Flex full>{confirmationContent}</Flex>
                <Flex full xAlign="end" wrap>
                    <Button {...cancelButtonProps} />
                    <Button {...confirmButtonProps} />
                </Flex>
            </Flex>
        </PopOver>
    );
};

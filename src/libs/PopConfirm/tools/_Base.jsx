import useVars from "./useVars";
import { Popover } from "../../Popover";
import { Flex } from "../../Flex";
import { Button } from "../../Button";

export const Base = (p) => {
    const {
        confirmButtonProps,
        cancelButtonProps,
        confirmationContent,
        popoverProps,
        children: panelChildren,
    } = useVars(p);

    /* Return */
    return (
        <Popover {...popoverProps}>
            <Flex.column gap={12} full>
                {confirmationContent}
                {panelChildren}
                <Flex full xAlign="end" wrap>
                    <Button {...cancelButtonProps} />
                    <Button {...confirmButtonProps} />
                </Flex>
            </Flex.column>
        </Popover>
    );
};

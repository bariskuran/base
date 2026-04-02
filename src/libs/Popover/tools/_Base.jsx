import useVars from "./useVars";
import { FloatingUi } from "../../FloatingUi";
import { Button } from "../../Button";

export const Base = ({ children, ...p }) => {
    const { isOpen, onClickHandler, floatingUiProps, buttonProps, uniqueId } = useVars(p);

    /* RETURN */
    return (
        <FloatingUi
            {...floatingUiProps}
            open={isOpen}
            onClick={onClickHandler}
            content={children}
            uniqueId={uniqueId}
            enableEscaping={true}
            alignY="top"
        >
            <Button
                activeManually={isOpen}
                {...(buttonProps || {
                    outlined: true,
                    icon: {
                        icon: "threeDotsLarge",
                        onActiveIcon: "threeDotsLargeHorizontal",
                        width: 18,
                    },
                })}
            />
        </FloatingUi>
    );
};

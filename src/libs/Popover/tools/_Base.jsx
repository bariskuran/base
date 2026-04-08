import useVars from "./useVars";
import { FloatingUi } from "../../FloatingUi";
import { Button } from "../../Button";
import { ScrollBox } from "../../ScrollBox";

export const Base = ({ children, ...p }) => {
    const {
        isOpen,
        onClickHandler,
        floatingUiProps,
        buttonProps,
        uniqueId,
        observerRef,
        scrollBoxProps,
    } = useVars(p);

    const content = <ScrollBox {...scrollBoxProps}>{children}</ScrollBox>;

    /* RETURN */
    return (
        <FloatingUi
            {...floatingUiProps}
            open={isOpen}
            onClick={onClickHandler}
            content={content}
            uniqueId={uniqueId}
            enableEscaping={true}
            alignY="top"
        >
            <Button
                ref={observerRef}
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

import useVars from "./useVars";
import { FloatingUi } from "../../FloatingUi";
import { Button } from "../../Button";
import { ScrollFlex } from "../../ScrollFlex";

export const Base = ({ children, ...p }) => {
    const {
        isOpen,
        onClickHandler,
        floatingUiProps,
        buttonProps,
        uniqueId,
        observerRef,
        scrollFlexProps,
    } = useVars(p);

    const { flexProps, scrollBarProps, ...restScrollFlexProps } = scrollFlexProps || {};

    /* RETURN */
    return (
        <FloatingUi
            {...floatingUiProps}
            open={isOpen}
            onClick={onClickHandler}
            content={
                <ScrollFlex
                    {...restScrollFlexProps}
                    flexProps={{ ...flexProps, maxHeight: 300, maxWidth: 300 }}
                    scrollBarProps={{ ...scrollBarProps }}
                >
                    {children}
                </ScrollFlex>
            }
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
                        activeIcon: "threeDotsLargeHorizontal",
                        width: 16,
                    },
                })}
            />
        </FloatingUi>
    );
};

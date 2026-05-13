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
        scrollBoxProps,
        dismissWithoutAnimationRef,
    } = useVars(p);

    const { flexProps, scrollBarProps, ...restScrollFlexProps } = scrollBoxProps || {};

    /* RETURN */
    return (
        <FloatingUi
            {...floatingUiProps}
            dismissWithoutAnimationRef={dismissWithoutAnimationRef}
            open={isOpen}
            onClick={onClickHandler}
            content={
                <ScrollFlex
                    {...restScrollFlexProps}
                    flexProps={{ ...flexProps }}
                    scrollBarProps={{ edgeMargin: 0, ...scrollBarProps }}
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
                {...(buttonProps || {})}
                icon={{
                    icon: "threeDotsLarge",
                    activeIcon: "threeDotsLargeHorizontal",
                    width: 16,
                    ...(buttonProps?.icon || {}),
                }}
            />
        </FloatingUi>
    );
};

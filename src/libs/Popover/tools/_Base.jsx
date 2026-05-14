import useVars from "./useVars";
import { FloatingUi } from "../../FloatingUi";
import { Button } from "../../Button";
import { ScrollFlex } from "../../ScrollFlex";

export const Base = ({ children, ...p }) => {
    const {
        isOpen,
        onClickHandler,
        onCloseHandler,
        buttonProps,
        floatingUiProps,
        scrollFlexProps,
        dismissWithoutAnimationRef,
    } = useVars(p);

    const { flexProps, scrollBarProps, ...restScrollFlexProps } = scrollFlexProps || {};

    /* Return */
    return (
        <FloatingUi
            {...floatingUiProps}
            dismissWithoutAnimationRef={dismissWithoutAnimationRef}
            open={isOpen}
            closeHandler={onCloseHandler}
            content={
                <ScrollFlex
                    padding={0}
                    {...restScrollFlexProps}
                    flexProps={flexProps}
                    scrollBarProps={{ edgeMargin: 0, ...scrollBarProps }}
                >
                    {children}
                </ScrollFlex>
            }
        >
            <Button
                activeManually={isOpen}
                {...(buttonProps || {})}
                onClick={(e) => {
                    buttonProps?.onClick?.(e);
                    onClickHandler(e);
                }}
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

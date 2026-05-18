import useVars from "./useVars";
import { FloatingUi } from "../../FloatingUi";
import { Button } from "../../Button";
import { ScrollFlex } from "../../ScrollFlex";

export const Base = ({ children, ...p }) => {
    const {
        isOpen,
        onClickHandler,
        onCloseHandler,
        buttonProps = {},
        floatingUiProps,
        scrollFlexProps,
        dismissWithoutAnimationRef,
        disableTriggerToggle,
    } = useVars(p);

    const { flexProps, scrollBarProps, ...restScrollFlexProps } = scrollFlexProps || {};

    const {
        icon: triggerIcon,
        activeManually: triggerActiveManually,
        onClick: triggerOnClick,
        ...triggerRestButtonProps
    } = buttonProps || {};

    const defaultTriggerIcon = {
        icon: "threeDotsLarge",
        activeIcon: "threeDotsLargeHorizontal",
        width: 16,
    };

    /* Return */
    return (
        <FloatingUi
            {...{ padding: 0, ...floatingUiProps }}
            dismissWithoutAnimationRef={dismissWithoutAnimationRef}
            open={isOpen}
            closeHandler={onCloseHandler}
            content={
                <ScrollFlex
                    padding={10}
                    autoWidth={false}
                    autoHeight={false}
                    maxWidth="20vw"
                    maxHeight="20vh"
                    {...restScrollFlexProps}
                    flexProps={flexProps}
                    scrollBarProps={scrollBarProps}
                >
                    {children}
                </ScrollFlex>
            }
        >
            <Button
                {...triggerRestButtonProps}
                icon={triggerIcon ?? defaultTriggerIcon}
                activeManually={triggerActiveManually ?? isOpen}
                onClick={(e) => {
                    triggerOnClick?.(e);
                    if (!disableTriggerToggle && !triggerRestButtonProps.disabled) {
                        onClickHandler(e);
                    }
                }}
            />
        </FloatingUi>
    );
};

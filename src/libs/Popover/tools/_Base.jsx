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
    } = useVars(p);

    const { flexProps, scrollBarProps, ...restScrollFlexProps } = scrollFlexProps || {};

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
                {...buttonProps}
                activeManually={isOpen}
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

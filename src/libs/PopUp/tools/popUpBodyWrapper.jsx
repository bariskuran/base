import { Button } from "../../Button";
import { Flex } from "../../Flex";
import { ScrollFlex } from "../../ScrollFlex";
import S from "./_styled";

export const PopUpBodyWrapper = ({
    useScrollFlex,
    scrollFlexProps,
    popUpContent,
    showFooter,
    hasCancelButton,
    hasConfirmButton,
    cancelButtonProps,
    confirmButtonProps,
    closeButtonProps,
    bodyProps,
    hideCloseButton,
}) => {
    const { flexProps, scrollBarProps, ...restScrollFlexProps } = scrollFlexProps || {};

    const footer = showFooter ? (
        <Flex justify="end" wrap gap={8} paddingTop={10}>
            {hasCancelButton && <Button {...cancelButtonProps} />}
            {hasConfirmButton && <Button {...confirmButtonProps} />}
        </Flex>
    ) : null;

    const scrollContent = (
        <>
            {popUpContent}
            {footer}
        </>
    );

    return (
        <>
            {!hideCloseButton && (
                <Flex justify="end" flexShrink={0} padding="10rem 10rem 0">
                    <Button.closeIcon {...closeButtonProps} />
                </Flex>
            )}
            {useScrollFlex ? (
                <S.body $useScrollFlex {...bodyProps}>
                    <ScrollFlex
                        variant="plain"
                        autoWidth={false}
                        full
                        padding={10}
                        paddingTop={0}
                        {...restScrollFlexProps}
                        flexProps={{
                            direction: "column",
                            xAlign: "stretch",
                            ...flexProps,
                        }}
                        scrollBarProps={{ trackMargin: 0, ...scrollBarProps }}
                    >
                        {scrollContent}
                    </ScrollFlex>
                </S.body>
            ) : (
                <S.body {...bodyProps}>{scrollContent}</S.body>
            )}
        </>
    );
};

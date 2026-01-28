import { useContext, useRef, forwardRef } from "react";
import { Popover } from "antd";
import styled from "styled-components";

import { FieldContext } from "../FieldContext";
import { useBase } from "../../../useBase";

export const Styled = {
    popoverFooter: styled.div`
        width: 100%;
        display: flex;
        gap: 10rem;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20rem;
    `,
    popoverButton: styled.button`
        width: max-content;
        height: 30rem;
        background: ${({ $isApprove, theme }) => ($isApprove ? theme.primary : theme.greyB7)};
        color: ${({ theme }) => theme.foreground};
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 15rem;
        margin: 0;
    `,
};

const ConfirmationContent = forwardRef((props, ref) => {
    return <div ref={ref}>{props.children}</div>;
});

ConfirmationContent.displayName = "ConfirmationContent";

export const Confirmation = ({ children }) => {
    const popoverRef = useRef(null);
    const [activePopover, setBase] = useBase((s) => [s.activePopover, s.set]);
    const {
        _fieldApi = {},
        _fieldApi: { confirmation, popoverId, onClickFromField, fieldType } = {},
        _formApi: { onConfirm } = {},
        updatePreviousValueFunctionFromField,
        restInputProps,
    } = useContext(FieldContext);

    const closeConfirmation = () => {
        setBase({ activePopover: null });
    };

    const handleOpenChangeForConfirmation = (newOpen) => {
        if (!newOpen) closeConfirmation();
    };

    /* Return */
    return (
        <div ref={popoverRef}>
            <Popover
                content={
                    <Styled.popoverFooter>
                        <Styled.popoverButton onClick={closeConfirmation}>No</Styled.popoverButton>
                        <Styled.popoverButton
                            $isApprove
                            onClick={() => {
                                closeConfirmation();

                                if (fieldType === "button") {
                                    onClickFromField();
                                } else {
                                    onConfirm(_fieldApi, {
                                        updatePreviousValueFunctionFromField,
                                        restInputProps,
                                    });
                                }
                            }}
                        >
                            Yes
                        </Styled.popoverButton>
                    </Styled.popoverFooter>
                }
                title={confirmation === true ? "Are you sure to continue?" : confirmation}
                trigger="click"
                open={activePopover === popoverId}
                onOpenChange={handleOpenChangeForConfirmation}
                placement="topRight"
                destroyTooltipOnHide
                getPopupContainer={() => popoverRef.current}
            >
                <ConfirmationContent>{children}</ConfirmationContent>
            </Popover>
        </div>
    );
};

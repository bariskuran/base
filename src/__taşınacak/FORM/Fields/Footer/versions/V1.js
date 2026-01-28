import React from "react";
import { Tooltip as TooltipOrj } from "antd";
import styled, { css } from "styled-components";
import { useDC } from "../../../../useDashStore";
import { Icon } from "../../../../Icon";
import { ButtonArea } from "../../ButtonArea";
import ButtonCancelField from "../../ButtonCancel";
import ButtonResetToDefaultsField from "../../ButtonResetToDefaults";
import ButtonResetToLastSubmittedField from "../../ButtonResetToLastSubmitted";
import ButtonSubmitField from "../../ButtonSubmit";

const ErrorArea = styled.div`
    ${({ $errorTextAlign }) => css`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: ${$errorTextAlign !== "right" ? "row-reverse" : "row"};
        cursor: pointer;
        font-size: 13rem;
        line-height: 1.2;
        text-align: ${$errorTextAlign};
        opacity: 0.7;
        gap: 5rem;
    `}
`;
const ErrorAreaWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

export const V1 = (p = {}) => {
    const {
        onCancel,
        onSubmit,
        onResetToDefaults,
        onResetToLastSubmitted,
        _formApi: { formName } = {},
        storeFile,
        inputProps: { buttonVersion, buttonAreaVersion, errorTextAlign = "right" } = {},
        formState: { isValid, isReadyOnAllConditionsMet, errorFieldLabels = [] } = {},
    } = p;

    const [set] = useDC(storeFile, (s) => [s.set]);

    /* */
    if (!isReadyOnAllConditionsMet) return null;
    return (
        <>
            <ErrorAreaWrapper>
                {!isValid && (
                    <TooltipOrj
                        title={
                            <>
                                Please check those fields: <br />
                                {errorFieldLabels.map((field, index) => (
                                    <React.Fragment key={index}>
                                        {index !== 0 && <br />}• {field}
                                    </React.Fragment>
                                ))}
                            </>
                        }
                        mouseEnterDelay={0.6}
                        mouseLeaveDelay={0}
                        onClick={() => {
                            set({ [formName + ".isDirty"]: true });
                        }}
                    >
                        <ErrorArea $errorTextAlign={errorTextAlign}>
                            <Icon icon="warning2" width={14} color="error" />
                            {`${errorFieldLabels.length} field${errorFieldLabels.length > 1 ? "s need" : " needs"} your attention.`}
                        </ErrorArea>
                    </TooltipOrj>
                )}
            </ErrorAreaWrapper>
            <ButtonArea buttonAreaVersion={buttonAreaVersion}>
                <ButtonCancelField buttonVersion={buttonVersion} onClick={onCancel} />
                <ButtonResetToDefaultsField
                    buttonVersion={buttonVersion}
                    onClick={onResetToDefaults}
                />
                <ButtonResetToLastSubmittedField
                    buttonVersion={buttonVersion}
                    onClick={onResetToLastSubmitted}
                />
                <ButtonSubmitField buttonVersion={buttonVersion} onClick={onSubmit} />
            </ButtonArea>
        </>
    );
};

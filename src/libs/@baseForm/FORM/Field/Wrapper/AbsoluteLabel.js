import styled, { css } from "styled-components";
import { useContext } from "react";
import { FieldContext } from "../FieldContext";

export const S = styled.div`
    ${({ enableAbsoluteLabel, label, placeholder, value }) => css`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        ${enableAbsoluteLabel &&
        (placeholder || label) &&
        css`
            &::before {
                position: absolute;
                content: "${placeholder || label}";
                top: ${value ? -2 : 0}rem;
                transition: all 0.25s ease-in-out;
                left: 11rem;
                font-size: 10rem;
                font-weight: 900;
                opacity: 0.4;
                text-transform: uppercase;
            }
        `}
    `}
`;

export const AbsoluteLabel = ({ children }) => {
    const {
        _fieldApi: { label, enableAbsoluteLabel } = {},
        restInputProps: { placeholder } = {},
        fieldState: { value } = {},
    } = useContext(FieldContext);

    /* */
    return (
        <S aria-label="AbsoluteLabel" {...{ enableAbsoluteLabel, label, placeholder, value }}>
            {children}
        </S>
    );
};

import { createContext, useEffect, useMemo } from "react";
import { _prepareFormApi } from "./_formApi";
import styled, { css } from "styled-components";
import { _mountForm } from "./_mountForm";
import { _unmountForm } from "./_unmountForm";

const FormWrapper = styled.div`
    ${({ $flexDirection, $flexGap, $flexJustify, $flexAlign }) => css`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: ${$flexDirection};
        gap: ${$flexGap}rem;
        justify-content: ${$flexJustify};
        align-items: ${$flexAlign};
        text-align: ${$flexAlign};
        width: 100%;
        margin: 0 auto;

        & > div:empty,
        &:empty,
        &:not(:has(> :not([style*="display: none"]))),
        &:not(:has(> :not(.nonHeaderField))),
        & > div:empty {
            display: none;
        }
    `}
`;

export const Context = ({ children, ...p }) => {
    const _formApi = useMemo(() => _prepareFormApi(p), [p]);

    useEffect(() => {
        _mountForm(_formApi);
        return () => {
            _unmountForm(_formApi);
        };
    }, []);

    /* Return */
    return (
        <FormContext value={_formApi}>
            <FormWrapper
                aria-label="FormWrapper"
                //
                $flexDirection={_formApi.flexDirection}
                $flexGap={_formApi.flexGap}
                $flexJustify={_formApi.flexJustify}
                $flexAlign={_formApi.flexAlign}
            >
                {children}
            </FormWrapper>
        </FormContext>
    );
};
export const FormContext = createContext();

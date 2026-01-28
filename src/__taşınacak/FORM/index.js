import styled from "styled-components";
import { Context } from "./Context";
import { createFormStore } from "../createFormStore";
import { Field } from "./Field";
import { RULES } from "./RULES";
import { Fields } from "./Fields";

export const FORM = {
    context: Context,
    createFormStore,
    field: Field,
    RULES,
    // Fields
    ...Fields,
    // generic styles
    multipleItems: styled.div`
        width: 100%;
        display: flex;
        gap: 10rem;
        justify-content: center;
        align-items: center;

        &:empty,
        &:not(:has(> :not([style*="display: none"]))),
        &:not(:has(> :not(.nonHeaderField))) {
            width: 0;
        }
    `,
    verLine: styled.div`
        width: 1px;
        min-width: 1px;
        background: ${({ theme }) => theme.greyB5};
        height: auto;
        min-height: 50rem;
    `,
};

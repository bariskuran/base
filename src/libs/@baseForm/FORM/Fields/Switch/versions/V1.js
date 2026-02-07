import styled, { css } from "styled-components";

export const V1 = styled.div`
    ${({ theme }) => css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;

        &:hover {
            & > .ant-switch {
                background: transparent !important;

                &.ant-switch-checked {
                    background: transparent !important;
                }
            }
        }

        & > .ant-switch {
            position: relative;
            width: fit-content;
            height: 100%;
            border-radius: 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background: transparent;

            &.ant-switch-checked {
                /* background: ${theme.successB8} !important; */

                & > .ant-switch-handle {
                    transform: translate(10rem, 0);
                    &::before {
                        background: ${theme.successB3} !important;
                    }
                }
            }

            & > .ant-switch-handle {
                display: none;
            }

            & > .ant-switch-inner {
                flex-direction: row-reverse;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 0;
                padding-inline-start: 15rem !important;
                padding-inline-end: 15rem !important;

                & > .ant-switch-inner-checked {
                    margin-top: 0;
                    color: ${theme.foreground} !important;
                }
                & > .ant-switch-inner-unchecked {
                    margin-top: 0;
                    color: ${theme.foreground} !important;
                }
            }
        }
    `}
`;

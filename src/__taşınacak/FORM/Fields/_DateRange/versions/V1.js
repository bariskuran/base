import styled, { css } from "styled-components";

export const V1 = styled.div`
    ${({ theme }) => css`
        position: relative;
        width: 100%;
        height: 100%;
        cursor: pointer;
        user-select: none;

        & > #stringArea {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: capitalize;
            opacity: 0.5;
        }
        & > .ant-picker {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            padding: 0;

            & > .ant-picker-input {
                height: 100%;
                &:nth-child(1) {
                    border-right: 1rem solid ${theme.greyB5};
                }

                & > input {
                    text-align: center;
                }
            }
            & > .ant-picker-range-separator {
                display: none;
            }
            & > .ant-picker-active-bar {
                height: 3rem;
            }
            & > .ant-picker-suffix {
                display: none;
            }
        }
    `}
`;

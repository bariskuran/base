import styled, { css } from "styled-components";

export const V1 = styled.div`
    ${() => css`
        width: 100%;
        position: relative;
        padding: 5rem;

        & > .ant-radio-group {
            width: 100%;

            & > #container {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10rem;

                & > .ant-radio-wrapper {
                    user-select: none;
                    cursor: pointer;
                    text-transform: capitalize;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12rem;

                    & > .ant-radio > .ant-radio-inner {
                        border-radius: 50;
                    }
                }
            }
        }
    `}
`;

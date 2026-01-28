import styled, { css } from "styled-components";

export const V1 = styled.div`
    ${() => css`
        width: 100%;
        position: relative;
        padding: 10rem;

        & > .ant-checkbox-group {
            width: 100%;

            & > #container {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15rem;

                & > .ant-checkbox-wrapper {
                    user-select: none;
                    cursor: pointer;
                    text-transform: capitalize;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    & > .ant-checkbox > .ant-checkbox-inner {
                        border-radius: 0;
                    }
                }
            }
        }
    `}
`;

import styled from "styled-components";

export const V1 = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    gap: 10rem;
    align-items: center;
    padding-left: 25rem;

    & > #slider {
        flex: 1 1 auto;

        & > .ant-slider > .ant-slider-handle > &::after {
            background: ${({ theme }) => theme.primary} !important;
        }
    }
    & > #inputArea {
        flex: 0 0 125rem;
    }
`;

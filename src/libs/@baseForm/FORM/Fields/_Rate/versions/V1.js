import styled from "styled-components";

export const V1 = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rem;

    & > .ant-rate > .ant-rate-star {
        color: ${({ theme }) => theme.primary} !important;
    }

    & > #label {
        font-size: 24rem;
        font-weight: 500;
        opacity: 0.2;
    }
`;

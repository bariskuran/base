import styled, { keyframes } from "styled-components";

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

export const V1 = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20rem;

    & > #total-text {
        flex: 0 0 max-content;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-left: 20rem;

        & > div {
            line-height: 1;
        }
        & > div:nth-child(2) {
            font-size: 11rem;
        }
    }
    & > #pagination-area {
        flex: 1 1 auto;
        display: flex;
        justify-content: flex-end;
    }
    & > #top-area {
        flex: 0 0 50rem;
        width: 50rem;
        height: 50rem;
        background: ${({ theme }) => theme.primaryB7};
        border-radius: 50rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 500ms ease-in-out;
        & > svg {
            animation: none;
            fill: ${({ theme }) => theme.foreground};
            transition: all 250ms ease-in-out;
        }

        &:hover {
            background: ${({ theme }) => theme.primary};
            transform: translateY(-5rem);
            & > svg {
                fill: ${({ theme }) => theme.background};
                animation: ${floatAnimation} 0.5s ease-in-out infinite;
            }
        }
    }
`;

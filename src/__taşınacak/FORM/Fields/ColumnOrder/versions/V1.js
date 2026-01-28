import styled, { css } from "styled-components";

export const V1 = {
    container: styled.div`
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 7rem;
        padding: 10rem;

        & > div {
            flex: 1;
            min-width: max-content;
        }

        &::after {
            content: "";
            flex: auto;
        }
    `,
    draggableArea: styled.div`
        ${({ $isVisible, $dragOver, $dragged, theme }) => css`
            borderleft: ${$dragOver ? "2px solid blue" : "none"};
            cursor: grab;

            &:active {
                cursor: grabbing;
            }

            & > div {
                display: flex;
                align-items: center;
                border-radius: 0 20rem 20rem 0;
                height: 40rem;
                padding: 0 10rem 0 5rem;
                font-size: 11rem;
                gap: 10rem;
                transition: all 0.25s ease-in-out;

                & > #label-area {
                    flex: 1;
                    text-align: left;
                }

                ${$isVisible
                    ? css`
                          opacity: 1;
                          background-color: ${theme.greyB9};
                          border: none;
                          cursor: move;

                          &:hover {
                              opacity: 1;
                              background-color: ${theme.greyB7};
                          }
                      `
                    : css`
                          opacity: 0.5;
                          background-color: transparent;
                          border: 1px solid ${theme.greyB5};
                      `}
                ${$dragOver &&
                css`
                    background-color: ${theme.primary};
                    & > * {
                        opacity: 0.1;
                    }
                `}
                ${$dragged &&
                css`
                    background: ${theme.secondaryB3} !important;
                `}
            }
        `}
    `,
};

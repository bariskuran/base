import { ButtonBase } from "../ButtonBase";
import styled, { css } from "styled-components";
import { joints, colorManager } from "./_joints";

export const V1 = styled(ButtonBase)`
    ${({
        theme,
        primary,
        secondary,
        error,
        success,
        preIcon,
        sufIcon,
        disableIconAnimation,
        label,
        isLoading,
        hoverManually,
    }) => {
        const color = colorManager({ theme, primary, secondary, error, success });
        const hover = css`
            & > #background {
                width: ${sufIcon || preIcon ? "calc(100% - 40rem)" : "100%"};
            }

            ${!isLoading &&
            css`
                background: ${theme.colorAlpha(color[2], 10)};
                ${joints.boxShadow1}

                & > #preIconArea,
                & > #sufIconArea {
                    background: ${color[1]};
                }

                ${!disableIconAnimation && label
                    ? css`
                          & > #preIconArea > svg {
                              margin-left: -8rem;
                          }
                          & > #sufIconArea > svg {
                              margin-right: -8rem;
                          }
                      `
                    : !disableIconAnimation
                      ? css`
                            & > #preIconArea > svg,
                            & > #sufIconArea > svg {
                                margin-top: -5rem;
                            }
                        `
                      : css``}
            `}
        `;

        /* Return */
        return css`
            &,
            &:hover,
            &:active,
            &:focus,
            &:visited {
                text-transform: uppercase;
                letter-spacing: 2rem;
                font-size: 10.5rem;
                font-weight: 500;
                width: fit-content;
                min-width: ${label ? 100 : 40}rem;
                height: 40rem;
                justify-content: center;
                align-items: center;
                border: 1px solid ${color[0]};

                & > #background {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    width: 0%;
                    ${sufIcon ? "right: 40rem" : preIcon ? "left: 40rem" : "left: 0"};
                    background: ${theme.colorAlpha(color[0], 50)};
                    ${joints.transition500ease}
                }
                & > #labelArea {
                    width: fit-content;
                    flex: 1 1 auto;
                    padding: 10rem;
                    display: flex;
                    justify-content: ${preIcon ? "flex-start" : sufIcon ? "flex-end" : "center"};
                }
                & > #preIconArea,
                & > #sufIconArea {
                    flex: 0 0 40rem;
                    width: 40rem;
                    height: 40rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: ${color[0]};
                    ${joints.transition250ease}

                    & > svg {
                        fill: white;
                        ${joints.transition250ease}
                    }
                }
            }

            &:hover {
                ${hover}
            }
            ${hoverManually && hover}
        `;
    }};
`;

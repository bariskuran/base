import { ButtonBase } from "../ButtonBase";
import styled, { css } from "styled-components";
import { joints, colorManager } from "./_joints";

export const V2 = styled(ButtonBase)`
    ${({
        theme,
        primary,
        secondary,
        error,
        success,
        preIcon,
        sufIcon,
        // disableIconAnimation,
        label,
        hoverManually,
        // isLoading,
        // isMobile,
    }) => {
        const color = colorManager({ theme, primary, secondary, error, success });
        const hover = css`
            & > #background {
                height: 40rem;
                background: ${color[2]};
            }
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
                width: max-content;
                min-width: 46rem;
                height: 40rem;
                justify-content: center;
                align-items: center;
                padding: 0 15rem;
                border-right: ${label ? 2 : 0}rem solid ${theme.greyB8};

                &:last-child {
                    border-right: none;
                }

                & > #background {
                    position: absolute;
                    bottom: 0;
                    height: ${primary ? 40 : 0}rem;
                    width: 100%;
                    ${sufIcon ? "right: 0" : "left: 0"};
                    ${joints.transition150linear}
                    background: ${color[0]};
                }

                & > #labelArea {
                }

                & > #preIconArea {
                    margin-right: ${preIcon && label ? 10 : 0}rem;
                }

                & > #sufIconArea {
                    margin-left: ${sufIcon && label ? 10 : 0}rem;
                }
            }

            &:hover {
                ${hover}
            }
            ${hoverManually && hover}

            ${theme.media(
                "phone,tablet",
                css`
                    &,
                    &:hover,
                    &:active,
                    &:focus,
                    &:visited {
                        height: 50rem;
                        border: 1rem solid ${theme.greyB5};
                        margin-right: 10rem;

                        &:last-child {
                            margin-right: 10rem;
                            border-right: 1rem solid ${theme.greyB5};
                        }

                        & > #labelArea {
                            font-size: 13rem;
                        }

                        & > #preIconArea,
                        & > #sufIconArea {
                            transform: scale(1.4);
                        }
                    }
                `,
            )}
        `;
    }};
`;
export const V2_narrow = styled(V2)`
    ${({
        theme,
        primary,
        secondary,
        error,
        success,
        // preIcon,
        // sufIcon,
        // disableIconAnimation,
        // label,
        hoverManually,
        // isLoading,
        // isMobile,
    }) => {
        const color = colorManager({ theme, primary, secondary, error, success });
        const hover = css`
            & > #background {
                height: 30rem;
                background: ${color[2]};
            }
        `;

        /* Return */
        return css`
            &,
            &:hover,
            &:active,
            &:focus,
            &:visited {
                text-transform: unset;
                letter-spacing: unset;
                font-size: 12rem;
                height: 30rem;

                & > #background {
                    height: ${primary ? 30 : 0}rem;
                }
            }

            &:hover {
                ${hover}
            }
            ${hoverManually && hover}

            ${theme.media(
                "phone,tablet",
                css`
                    &,
                    &:hover,
                    &:active,
                    &:focus,
                    &:visited {
                        height: 30rem;
                    }
                `,
            )}
        `;
    }};
`;

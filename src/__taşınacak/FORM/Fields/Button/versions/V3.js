import { ButtonBase } from "../ButtonBase";
import styled, { css } from "styled-components";
import { joints, colorManager } from "./_joints";

export const V3 = styled(ButtonBase)`
    ${({
        theme,
        primary,
        secondary,
        error,
        success,
        $isSelected,
        hoverManually,
        // preIcon,
        // sufIcon,
        // disableIconAnimation,
        label,
        // isLoading,
        // isMobile,
    }) => {
        const color = colorManager({ theme, primary, secondary, error, success });
        const hover = css`
            &::before,
            &::after {
                width: 50%;
                opacity: 1;
            }
            &::before {
                left: 0%;
            }
            &::after {
                right: 0%;
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
                font-size: 11.5rem;
                font-weight: 500;
                width: max-content;
                padding: 0;
                ${joints.transition150linear}

                & > #preIconArea {
                    margin-right: ${label ? 10 : 0}rem;
                }

                & > #sufIconArea {
                    margin-left: ${label ? 10 : 0}rem;
                }

                &::before {
                    content: "";
                    width: 0%;
                    opacity: 0;
                    position: absolute;
                    bottom: -4rem;
                    left: 50%;
                    height: 2rem;
                    background: ${color[0]};
                    ${joints.transition150linear}
                }
                &::after {
                    content: "";
                    width: 0%;
                    opacity: 0;
                    position: absolute;
                    bottom: -4rem;
                    right: 50%;
                    height: 2rem;
                    background: ${color[0]};
                    ${joints.transition150linear}
                }

                ${$isSelected &&
                css`
                    margin-right: -30rem;
                    pointer-events: none;
                    cursor: default;

                    &::after {
                        margin-right: -30rem;
                        width: calc(50% + 30rem);
                        opacity: 1;
                    }

                    &::before {
                        width: 50%;
                        opacity: 1;
                    }
                `}
            }

            &:hover {
                ${hover}
            }
            ${hoverManually && hover}
        `;
    }};
`;

// ${theme.media("phone,tablet", css``)}

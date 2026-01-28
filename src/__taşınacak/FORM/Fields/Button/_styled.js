import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { joints } from "./versions/_joints";

const joint = css`
    &,
    &:hover,
    &:active,
    &:focus,
    &:visited {
        ${({ theme, $disabled, $isLoading, $tooltip, isMobile }) => css`
            padding: 0;
            margin: 0;
            background: transparent;
            color: ${theme.foreground};
            position: relative;
            cursor: pointer;
            outline: none;
            box-shadow: none;
            user-select: none;
            box-sizing: border-box;
            border: none;
            text-decoration: none;
            display: flex;
            align-items: center;
            ${joints.transition150}

            & > #spin {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                & > .ant-spin-dot-holder > .ant-spin-dot > .ant-spin-dot-item {
                    opacity: 1 !important;
                    color: ${theme.foreground} !important;
                }
            }

            & > #background {
                z-index: 1;
            }

            & > #labelArea {
                ${joints.transition150}
                z-index:2;
            }
            & > #preIconArea,
            & > #sufIconArea {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                z-index: 3;
                ${joints.transition150}
            }

            ${$disabled &&
            css`
                pointer-events: none;
                filter: blur(5px) grayscale(100%);
                opacity: 0.5;

                &:focus {
                    outline: none !important;
                }
            `}

            ${$isLoading &&
            css`
                pointer-events: none;
                opacity: 0.5;
                position: relative;
                border: none !important;
                & > *:not(#spin) {
                    filter: blur(5px) grayscale(100%);
                }

                &:focus {
                    outline: none !important;
                }
            `}

            ${$tooltip &&
            css`
                margin-right: 0;
            `}

    ${isMobile &&
            theme.media(
                "phone,tablet",
                css`
                    & > #preIconArea,
                    & > #sufIconArea {
                        display: none;
                    }
                `,
            )};

            &:focus {
                outline: 2rem dotted ${theme.primary};
            }
        `}
    }
`;

export const StyledA = styled.a`
    ${joint}
`;
export const StyledButton = styled.button`
    ${joint}
`;
export const StyledLink = styled(Link)`
    ${joint}
`;
export const TooltipSpan = styled.span`
    ${({ theme }) =>
        theme.media(
            "phone,tablet",
            css`
                margin-right: 10rem;
                &:last-child {
                    margin-right: 0;
                }
            `,
        )}
`;

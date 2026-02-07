import styled, { css } from "styled-components";

export const Container = styled.div`
    ${({ theme, $disabled, $isError, $isFieldFocused, $enableSearchClear }) => {
        const hover = css`
            &::before {
                height: 100%;
            }
            ${$isError &&
            css`
                background: ${theme.errorB7};
            `}
        `;

        return css`
            width: 100%;
            position: relative;
            display: grid;
            grid-template-columns: 40rem auto ${$enableSearchClear ? 40 : 0}rem;
            grid-template-rows: auto;
            align-items: center;
            user-select: none;
            cursor: pointer;
            transition: all 0.25s ease-in-out;
            grid-template-areas: "labelIcon content actionsArea";

            &::before {
                content: "";
                position: absolute;
                display: block;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0%;
                transition: all 0.25s ease-in-out;
                background: ${theme.background};
                z-index: 0;
            }

            & > #skeleton {
                width: 100%;
                height: 100%;
                background: red;
            }

            & > #labelIcon {
                grid-area: labelIcon;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            & > #content {
                z-index: 10;
                position: relative;
                grid-area: content;
                height: 100%;
                min-height: 40rem;
                display: flex;
                align-items: center;
                border-right: ${$enableSearchClear ? 0 : 2}rem solid
                    ${$isError ? theme.errorF2 : theme.greyB8};

                & > div,
                & > span {
                    width: 100%;
                }
            }

            & > #actionsArea {
                grid-area: actionsArea;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                border-right: 1rem solid ${$isError ? theme.errorF2 : theme.greyB5};
            }

            ${$isError &&
            css`
                background: ${theme.errorB7};
                & > #errorText {
                    height: 30rem;
                }
            `}

            ${$disabled &&
            css`
                pointer-events: none;
                filter: blur(2px) grayscale(100%);
                opacity: 0.5;
            `}

            /* Hover */
            &:hover {
                ${hover}
            }
            ${$isFieldFocused && hover}
        `;
    }}
`;

export const DebugWrapper = styled.div`
    ${({ $nonHeaderField }) => {
        if ($nonHeaderField)
            return css`
                display: none;
            `;
        return css`
            display: flex;
            flex-direction: column;
            gap: 10rem;
            width: 100%;
            position: relative;

            & > #debugArea {
                word-break: break-all;
            }
        `;
    }}
`;

import styled, { css } from "styled-components";

export const Container = styled.div`
    ${({
        theme,
        $disabled,
        $isError,
        $hiddenError,
        $isFieldFocused,
        $disableHoverBackground,
        //    $semiHiddenError
    }) => {
        const hover = css`
            &::before {
                height: ${$disableHoverBackground ? false : "100%"};
            }

            ${$isError &&
            css`
                background: ${theme.errorB9};
            `}
        `;

        return css`
            width: 100%;
            height: 100%;
            position: relative;
            border-bottom: 1rem solid ${theme.greyB5};
            display: grid;
            grid-template-columns: 5rem 150rem auto 30rem;
            grid-template-rows: auto auto auto auto;
            align-items: center;
            user-select: none;
            cursor: ${$disableHoverBackground ? "default" : "pointer"};
            transition: all 0.25s ease-in-out;
            grid-template-areas:
                "required label content actionsArea"
                "required label errorText actionsArea";

            &::before {
                content: "";
                position: absolute;
                display: block;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0%;
                transition: all 0.15s ease-in-out;
                background: ${$isError ? theme.errorB9 : theme.colorAlpha(theme.greyB9, 75)};
                z-index: 0;
            }

            & > #skeleton {
                width: 100%;
                height: 100%;
                background: red;
            }
            & > #required {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                grid-area: required;
                font-size: 20rem;
                font-weight: 100;
                height: 100%;
                background: ${$hiddenError || $isError ? theme.errorB5 : theme.greyB8};
                z-index: 2;
            }
            & > #label {
                width: 100%;
                height: 100%;
                grid-area: label;
                text-transform: uppercase;
                letter-spacing: 1rem;
                line-height: 1.5;
                font-size: 11rem;
                font-weight: 600;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                text-align: left;
                padding: 0 10rem;
                background: ${$isError ? theme.errorB7 : theme.colorAlpha(theme.greyB9, 75)};
                z-index: 1;
            }
            & > #content {
                z-index: 10;
                position: relative;
                grid-area: content;
                height: 100%;
                min-height: 50rem;
                display: flex;
                align-items: center;
                border-left: 1rem solid ${$isError ? theme.errorF2 : theme.greyB5};

                & > div,
                & > span {
                    width: 100%;
                }
            }
            & > #debugArea {
                grid-area: debugArea;
            }
            & > #actionsArea {
                grid-area: actionsArea;
                border-left: 1rem solid ${theme.greyB5};
                border-right: 1rem solid ${theme.greyB5};
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10rem;
                height: 100%;
            }

            & > #errorText {
                grid-area: errorText;
                height: 0rem;
                overflow-y: hidden;
                transition: all 0.25s;
                display: flex;
                align-items: center;
                font-size: 13rem;
                padding: 0 30rem;
                opacity: 0;
                border-top: 1rem solid ${theme.greyB5};
                border-left: 1rem solid ${$isError ? theme.errorF2 : theme.greyB5};
            }

            ${$isError &&
            css`
                & > #errorText {
                    opacity: 1;
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
    display: flex;
    flex-direction: column;
    gap: 10rem;
    width: 100%;
    position: relative;

    & > #debugArea {
        word-break: break-all;
    }
`;

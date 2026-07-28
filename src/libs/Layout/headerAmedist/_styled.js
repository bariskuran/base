import styled, { css } from "styled-components";

const getThemeColor = (theme, value, fallback) =>
    theme.colorGet?.(value || fallback)?.color || theme[value] || value || theme[fallback];

export const S = {
    container: styled.header`
        width: 100%;
        position: sticky;
        top: 0;
        height: ${({ $status, $extendedHeight, $condensedHeight }) =>
            $status === "hidden"
                ? 0
                : $status === "condensed"
                  ? $condensedHeight
                  : $extendedHeight}rem;
        margin-bottom: ${({ $status, $extendedHeight }) =>
            $status === "hidden" ? 0 : -$extendedHeight}rem;
        box-sizing: border-box;
        color: ${({ theme, $headerColor }) => getThemeColor(theme, $headerColor, "foreground")};
        background: ${({ theme, $headerBackgroundColor, $headerBackgroundAlpha }) =>
            theme.colorAlpha(
                getThemeColor(theme, $headerBackgroundColor, "background"),
                $headerBackgroundAlpha,
            )};
        backdrop-filter: blur(5rem);
        -webkit-backdrop-filter: blur(5rem);
        font-family: "Montserrat", sans-serif;
        border: ${({ $status }) => ($status === "hidden" ? 0 : 1)}px solid
            color-mix(in srgb, currentColor 50%, transparent);
        border-left: none;
        border-right: none;
        z-index: 4;
        overflow: hidden;
        pointer-events: ${({ $status }) => ($status === "hidden" ? "none" : "auto")};
        transition:
            height 0.25s ease,
            margin-bottom 0.25s ease,
            background-color 0.25s ease,
            border-color 0.25s ease;
    `,
    body: styled.div`
        width: 100%;
        height: ${({ $status, $extendedHeight, $condensedHeight }) =>
            $status === "hidden"
                ? 0
                : $status === "condensed"
                  ? $condensedHeight
                  : $extendedHeight}rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: height 0.25s ease;

        & > div:nth-child(1) {
            flex: 0 0 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10rem 30rem;
            box-sizing: border-box;
        }

        & > div:nth-child(2) {
            flex: 0 0 1px;
            border-right: 1px solid color-mix(in srgb, currentColor 50%, transparent);
            height: 100%;
        }

        & > div:nth-child(3) {
            flex: 1 1 auto;
            min-width: 0;
            padding: 10rem 30rem 10rem 0;
        }

        & > div:nth-child(4) {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30rem;
            padding-right: 30rem;
        }
    `,
    logoButton: styled.button`
        all: unset;
        width: ${({ $status }) => ($status === "condensed" ? "160px" : "200px")};
        height: ${({ $status, $extendedHeight, $condensedHeight }) =>
            Math.max(($status === "condensed" ? $condensedHeight : $extendedHeight) - 20, 1)}rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    `,
    logoMask: styled.span`
        width: 100%;
        height: 100%;
        display: block;
        background-color: currentColor;
        mask-image: url(${({ $src }) => $src});
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: contain;
        -webkit-mask-image: url(${({ $src }) => $src});
        -webkit-mask-position: center;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: contain;
    `,
    input: styled.input`
        width: 100%;
        height: ${({ $height }) => $height}rem;
        line-height: ${({ $height }) => $height}rem;
        padding: 0 0 0 30rem;
        box-sizing: border-box;
        border: none;
        outline: none;
        background: transparent;
        color: inherit;
        font: inherit;
        appearance: none;

        &::placeholder {
            color: currentColor;
            opacity: 1;
            font-weight: 500;
        }
    `,
};

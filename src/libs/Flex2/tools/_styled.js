import styled, { css } from "styled-components";

export const S = {
    container: styled.div`
        ${({ $width, $height, $direction, $gap }) => css`
            overflow: hidden !important;
            //
            padding-bottom: 14px;
            background-color: yellow;
            //
            display: flex;
            width: ${$width ? $width + "px " : "100%"};
            max-width: 100%;
            height: ${$height ? $height + "px" : ""};
            flex-direction: ${$direction || "row"};
            gap: ${$gap};
        `}
    `,
    content: styled.div`
        background-color: blue;
        width: fit-content;
    `,
};

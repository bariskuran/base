import styled, { css } from "styled-components";

const S = {
    iframe: styled.iframe`
        ${({ $width, $height }) => css`
            all: unset;
            display: block;
            box-sizing: border-box;
            width: ${$width};
            height: ${$height};
            max-width: 100%;
            border: 0;
        `}
    `,
};

export default S;

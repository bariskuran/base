import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${({ $size }) => css`
            height: ${$size};
        `}
    `,
};
export default S;

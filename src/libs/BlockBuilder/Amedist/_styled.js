import styled from "styled-components";

const S = {
    container: styled.section`
        position: relative;
        z-index: 1;
        width: 100%;
        box-sizing: border-box;
        color: ${({ theme }) => theme.foreground};
    `,
};

export default S;

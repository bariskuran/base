import styled from "styled-components";

const S = {
    container: styled.div`
        min-width: 0;
        transform: translate3d(0, var(--paralax-y, 0px), 0);
        will-change: transform;

        @media (prefers-reduced-motion: reduce) {
            transform: none;
            will-change: auto;
        }
    `,
};

export default S;

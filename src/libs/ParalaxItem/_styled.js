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
    coverContainer: styled.div`
        position: relative;
        max-width: 100%;
        overflow: hidden;

        > span {
            display: block;
            max-width: none;
        }

        img {
            display: block;
            min-height: 100%;
            transform: translate3d(var(--paralax-cover-x, 0px), var(--paralax-cover-y, 0px), 0);
            will-change: transform;
        }

        &[data-paralax-axis="y"] {
            > span,
            img {
                width: 100%;
                height: auto;
            }
        }

        &[data-paralax-axis="x"] {
            > span {
                width: auto;
                height: 100%;
            }

            img {
                width: auto;
                height: 100%;
                min-width: 100%;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            img {
                transform: none;
                will-change: auto;
            }
        }
    `,
};

export default S;

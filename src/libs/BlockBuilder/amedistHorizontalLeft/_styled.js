import styled from "styled-components";

const motionArea = styled.div`
    min-width: 0;
    display: flex;
    align-items: center;
`;

const S = {
    container: styled.article`
        position: relative;
        isolation: isolate;
        width: 100%;
        min-height: 64vh;
        padding: 0 150rem;
        display: grid;
        grid-template-columns: 11fr 5fr;
        align-items: center;
        box-sizing: border-box;

        @media (max-width: 700px) {
            width: 100%;
            padding: 0 24rem;
            min-height: 0;
            grid-template-columns: minmax(0, 1fr);
            gap: 30rem;
        }
    `,
    imageMotion: styled(motionArea)`
        position: relative;
        z-index: 1;
        grid-column: 1;
        height: clamp(300rem, 64vh, 680rem);

        & > * {
            width: 100%;
            height: 100%;
        }

        @media (max-width: 700px) {
            grid-column: 1;
            grid-row: 2;
            height: auto;
        }
    `,
    imageArea: styled.div`
        width: 100%;
        height: 100%;
        overflow: hidden;

        & > *,
        & img {
            width: 100%;
            height: 100%;
        }

        @media (max-width: 700px) {
            aspect-ratio: 3 / 2;
        }
    `,
    textMotion: styled(motionArea)`
        position: relative;
        z-index: 1;
        grid-column: 2;
        align-self: center;
        align-items: center;
        padding: 0 32rem;

        @media (max-width: 700px) {
            grid-column: 1;
            grid-row: 1;
            padding: 20rem 0;
        }
    `,
    textArea: styled.div`
        width: 100%;
        min-width: 0;

        & > :last-child {
            margin-bottom: 0;
        }
    `,
};

export default S;

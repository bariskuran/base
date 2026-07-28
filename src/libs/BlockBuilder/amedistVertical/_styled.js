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
        min-height: 72vh;
        padding: 0 150rem;
        display: grid;
        grid-template-columns: 5fr 6fr 5fr;
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
    textMotion1: styled(motionArea)`
        position: relative;
        z-index: 1;
        grid-column: 1;
        align-self: center;
        align-items: center;
        padding: 0 32rem 0 0;

        @media (max-width: 700px) {
            grid-column: 1;
            grid-row: 1;
            padding: 20rem 0;
        }
    `,
    imageMotion: styled(motionArea)`
        position: relative;
        z-index: 1;
        grid-column: 2;
        height: auto;
        max-height: clamp(380rem, 72vh, 760rem);
        align-self: center;

        & > * {
            width: 100%;
            height: auto;
            max-height: inherit;
        }

        @media (max-width: 700px) {
            grid-column: 1;
            grid-row: 2;
            max-height: none;
        }
    `,
    imageArea: styled.div`
        width: 100%;
        height: auto;
        max-height: inherit;
        display: flex;
        align-items: center;
        justify-content: center;

        & > * {
            width: 100%;
            height: auto !important;
            max-height: inherit;
        }

        & img {
            width: 100%;
            height: auto !important;
            max-height: inherit;
            object-fit: contain !important;
        }

        @media (max-width: 700px) {
            max-height: none;
        }
    `,
    textMotion2: styled(motionArea)`
        position: relative;
        z-index: 1;
        grid-column: 3;
        align-self: center;
        align-items: center;
        padding: 0 0 0 32rem;

        @media (max-width: 700px) {
            grid-column: 1;
            grid-row: 3;
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

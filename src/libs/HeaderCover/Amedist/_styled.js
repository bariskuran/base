import styled from "styled-components";

const resolveThemeColor = (theme, color) => theme[color] || color || theme.foreground;
const resolveInverseSliderColor = (theme, color) =>
    color === "background" ? theme.foreground : theme.background;

const S = {
    container: styled.header`
        position: relative;
        isolation: isolate;
        width: 100%;
        height: calc(100vh + 130rem);
        min-height: 690rem;
        color: ${({ theme }) => theme.foreground};
    `,
    coverStage: styled.div`
        position: absolute;
        inset: 0 0 auto;
        width: 100%;
        height: 100vh;
        min-height: 560rem;
    `,
    coverLayer: styled.div`
        position: fixed;
        inset: 0;
        z-index: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: ${({ theme }) => theme.background};
        opacity: ${({ $pastThreshold }) => ($pastThreshold ? 0.11 : 1)};
        transition: opacity 420ms ease;
        pointer-events: none;

        & > div,
        & img {
            width: 100%;
            height: 100%;
        }

        & img {
            object-fit: cover;
        }
    `,
    title: styled.h1`
        position: absolute;
        z-index: 1;
        isolation: isolate;
        left: 150rem;
        bottom: 205rem;
        width: fit-content;
        max-width: calc(100vw - 180rem);
        box-sizing: border-box;
        padding: 36rem 186rem 50rem 36rem;
        margin: 0;
        color: ${({ theme, $sliderColor, $pastThreshold }) =>
            $pastThreshold ? theme.foreground : resolveThemeColor(theme, $sliderColor)};
        font: inherit;
        letter-spacing: -0.035em;
        line-height: 0.7;
        transition: color 420ms ease;

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            background: ${({ theme, $sliderColor }) =>
                theme.colorAlpha(resolveInverseSliderColor(theme, $sliderColor), 0.6)};
            opacity: ${({ $pastThreshold }) => ($pastThreshold ? 0 : 1)};
            backdrop-filter: blur(2rem);
            -webkit-backdrop-filter: blur(2rem);
            transition: opacity 420ms ease;
            pointer-events: none;
        }

        @media (max-width: 700px) {
            left: 24rem;
            max-width: calc(100vw - 48rem);
            padding-right: 174rem;
            padding-left: 24rem;
        }
    `,
    titleFirstLine: styled.span`
        display: block;
        font-size: clamp(21.375rem, 2.53125vw, 40.5rem);
        font-weight: 700;
    `,
    titleSecondLine: styled.span`
        display: block;
        margin-left: clamp(18rem, 3vw, 58rem);
        font-size: clamp(32.625rem, 3.9375vw, 63rem);
        font-weight: 300;
    `,
    contentArea: styled.div`
        position: absolute;
        z-index: 2;
        top: calc(100vh - 205rem);
        left: 0;
        width: 100%;
        display: flex;
        align-items: flex-start;

        @media (max-width: 700px) {
            padding: 0 24rem;
            box-sizing: border-box;
        }
    `,
    area1: styled.div`
        position: relative;
        z-index: 0;
        flex: 0 0 160rem;
        height: 90rem;
        margin-top: 15rem;
        margin-right: -10rem;
        background: ${({ theme }) => theme.colorAlpha(theme.background, 10)};
        backdrop-filter: blur(3rem);
        -webkit-backdrop-filter: blur(3rem);

        @media (max-width: 700px) {
            display: none;
        }
    `,
    info: styled.div`
        position: relative;
        z-index: 1;
        flex: 0 0 50%;
        min-width: 0;
        min-height: 220rem;
        padding: 24rem 36rem 32rem;
        background: ${({ theme }) => theme.colorAlpha(theme.background, 0.7)};
        backdrop-filter: blur(2rem);
        -webkit-backdrop-filter: blur(2rem);

        @media (max-width: 700px) {
            flex: 1 1 auto;
            padding: 22rem 24rem 28rem;
        }
    `,
    meta: styled.div`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 13rem 50rem;
        min-height: 23rem;
        font-size: 14.3rem;
        font-weight: 500;
    `,
    metaItem: styled.span`
        display: inline-flex;
        align-items: center;
        gap: 9rem;
        line-height: 1;
        white-space: nowrap;
    `,
    divider: styled.div`
        width: 78rem;
        height: 2px;
        margin: 18rem 0 20rem;
        background: ${({ theme }) => theme.primary};
    `,
    quote: styled.blockquote`
        max-width: 650rem;
        margin: 0;
        font-size: clamp(15.3rem, 1.395vw, 21.6rem);
        font-weight: 300;
        line-height: 1.63;
        letter-spacing: -0.012em;
        text-wrap: balance;
    `,
    area3: styled.div`
        flex: 1 1 auto;
        height: 40rem;
        margin-top: 50rem;
        background: ${({ theme }) => theme.colorAlpha(theme.background, 10)};
        backdrop-filter: blur(3rem);
        -webkit-backdrop-filter: blur(3rem);

        @media (max-width: 700px) {
            display: none;
        }
    `,
};

export default S;

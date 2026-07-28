import { Image } from "../../Image";
import styled from "styled-components";
import { normalizeStoryText, StoryTextList } from "../textItems";

const S = {
    container: styled.article`
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: 11fr 5fr;
        grid-template-rows: minmax(100vh, auto);
        width: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        pointer-events: auto;
        isolation: isolate;
        background: ${({ theme }) => theme.background};
    `,
    imageArea: styled.div`
        position: sticky;
        top: 0;
        min-width: 0;
        height: 100vh;
        box-sizing: border-box;
        align-self: start;
        z-index: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    textArea: styled.div`
        position: relative;
        min-width: 0;
        min-height: 100vh;
        height: max-content;
        box-sizing: border-box;
        padding: 100rem 60rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: safe flex-end;
        gap: 0;

        & > * {
            flex-shrink: 0;
        }
    `,
    largeSlideNumber: styled.span`
        position: absolute;
        top: 50rem;
        left: 50rem;
        z-index: 2;
        pointer-events: none;
        font-weight: 100;
        opacity: 0.06;
        font-size: 1250%;
        line-height: 0.7;
        letter-spacing: -0.05em;
    `,
};

const AmedistHorizontalLeft = ({ story = {}, index, slideNumber, slideCount, onImageLoad }) => {
    const textList = normalizeStoryText(story.text);

    return (
        <S.container
            data-slide-design="amedistHorizontalLeft"
            data-slide-index={index}
            data-slide-number={slideNumber}
            data-slide-count={slideCount}
        >
            <S.imageArea data-slot="image">
                {story.image && (
                    <Image
                        catalogSet={story.image}
                        alt=""
                        objectFit="contain"
                        w="100%"
                        h="auto"
                        onLoad={onImageLoad}
                    />
                )}
            </S.imageArea>
            <S.textArea data-slot="text">
                <S.largeSlideNumber aria-hidden="true">{slideNumber}</S.largeSlideNumber>
                <StoryTextList items={textList} balance marginBottom={20} />
            </S.textArea>
        </S.container>
    );
};

export default AmedistHorizontalLeft;

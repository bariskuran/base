import { Image } from "../../Image";
import styled from "styled-components";
import { normalizeStoryText, normalizeStoryTextItem, StoryTextList } from "../textItems";

const S = {
    container: styled.article`
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: 5fr 6fr 5fr;
        grid-template-rows: minmax(50vh, auto) minmax(50vh, auto);
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        pointer-events: auto;
        isolation: isolate;
        background: ${({ theme }) => theme.background};
    `,
    textArea: styled.div`
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        min-height: 50vh;
        box-sizing: border-box;
        padding: 100rem 45rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 0;

        & > * {
            flex-shrink: 0;
        }
    `,
    textArea2: styled.div`
        grid-column: 3;
        grid-row: 2;
        min-width: 0;
        min-height: 50vh;
        box-sizing: border-box;
        padding: 100rem 45rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 0;

        & > * {
            flex-shrink: 0;
        }
    `,
    imageArea: styled.div`
        position: sticky;
        top: 0;
        grid-column: 2;
        grid-row: 1 / -1;
        min-width: 0;
        height: 100vh;
        align-self: start;
        z-index: 0;
        overflow: hidden;
    `,
    largeSlideNumber: styled.span`
        position: absolute;
        grid-column: 3;
        grid-row: 1;
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

export const normalizeVerticalTextItem = normalizeStoryTextItem;

export const splitVerticalText = (text) => {
    const textList = normalizeStoryText(text);
    const splitIndex = Math.ceil(textList.length / 2);
    return [textList.slice(0, splitIndex), textList.slice(splitIndex)];
};

const AmedistVertical = ({ story = {}, index, slideNumber, slideCount, onImageLoad }) => {
    const [text1, text2] = splitVerticalText(story.text);

    return (
        <S.container
            data-slide-design="amedistVertical"
            data-slide-index={index}
            data-slide-number={slideNumber}
            data-slide-count={slideCount}
        >
            <S.largeSlideNumber aria-hidden="true">{slideNumber}</S.largeSlideNumber>
            <S.textArea data-slot="text1">
                <StoryTextList items={text1} balance marginBottom={20} />
            </S.textArea>
            <S.imageArea data-slot="image">
                {story.image && (
                    <Image
                        catalogSet={story.image}
                        alt=""
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        onLoad={onImageLoad}
                    />
                )}
            </S.imageArea>
            <S.textArea2 data-slot="text2">
                <StoryTextList items={text2} balance marginBottom={20} />
            </S.textArea2>
        </S.container>
    );
};

export default AmedistVertical;

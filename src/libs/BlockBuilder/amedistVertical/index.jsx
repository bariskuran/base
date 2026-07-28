import { Image } from "../../Image";
import { ParalaxItem } from "../../ParalaxItem";
import { ScrollAnimatedItem } from "../../ScrollAnimatedItem";
import { StoryTextList, normalizeStoryText } from "../../StoryTeller/textItems";
import S from "./_styled";

const splitText = (text) => {
    const textList = normalizeStoryText(text);
    const splitIndex = Math.ceil(textList.length / 2);
    return [textList.slice(0, splitIndex), textList.slice(splitIndex)];
};

const AmedistVertical = ({ block = {}, index }) => {
    const [text1, text2] = splitText(block.text);

    return (
        <S.container data-block-design="amedistVertical" data-block-index={index}>
            <S.textMotion1>
                <ScrollAnimatedItem animationMs={1000} distance={0}>
                    <ParalaxItem speed={-25}>
                        <S.textArea>
                            <StoryTextList items={text1} balance marginBottom={20} />
                        </S.textArea>
                    </ParalaxItem>
                </ScrollAnimatedItem>
            </S.textMotion1>
            <S.imageMotion>
                <ScrollAnimatedItem animationMs={1000} distance={0}>
                    <S.imageArea>
                        {(block.image || block.imageProps) && (
                            <Image
                                {...(block.imageProps || { catalogSet: block.image })}
                                alt=""
                                w="100%"
                                h="auto"
                                objectFit="contain"
                                loadInViewport
                            />
                        )}
                    </S.imageArea>
                </ScrollAnimatedItem>
            </S.imageMotion>
            <S.textMotion2>
                <ScrollAnimatedItem animationMs={1000} distance={0}>
                    <ParalaxItem speed={25}>
                        <S.textArea>
                            <StoryTextList items={text2} balance marginBottom={20} />
                        </S.textArea>
                    </ParalaxItem>
                </ScrollAnimatedItem>
            </S.textMotion2>
        </S.container>
    );
};

export default AmedistVertical;

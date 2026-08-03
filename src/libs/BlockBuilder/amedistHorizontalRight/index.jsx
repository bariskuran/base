import { Image } from "../../Image";
import { ParalaxItem } from "../../ParalaxItem";
import { ScrollAnimatedItem } from "../../ScrollAnimatedItem";
import { StoryTextList, normalizeStoryText } from "../../StoryTeller/textItems";
import S from "./_styled";

const AmedistHorizontalRight = ({ block = {}, index }) => {
    const textList = normalizeStoryText(block.text);

    return (
        <S.container data-block-design="amedistHorizontalRight" data-block-index={index}>
            <S.textMotion>
                <ScrollAnimatedItem animationMs={1000} distance={0}>
                    <ParalaxItem.speed speed={-25}>
                        <S.textArea>
                            <StoryTextList items={textList} balance marginBottom={20} />
                        </S.textArea>
                    </ParalaxItem.speed>
                </ScrollAnimatedItem>
            </S.textMotion>
            <S.imageMotion>
                <ScrollAnimatedItem animationMs={1000} distance={0}>
                    <ParalaxItem.speed speed={25}>
                        <S.imageArea>
                            {(block.image || block.imageProps) && (
                                <Image
                                    {...(block.imageProps || { catalogSet: block.image })}
                                    alt=""
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                    loadInViewport
                                />
                            )}
                        </S.imageArea>
                    </ParalaxItem.speed>
                </ScrollAnimatedItem>
            </S.imageMotion>
        </S.container>
    );
};

export default AmedistHorizontalRight;

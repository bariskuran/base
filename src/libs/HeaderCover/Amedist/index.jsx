import { isValidElement } from "react";
import { Icon } from "../../Icon";
import { Image } from "../../Image";
import NestedBaseUi from "helpers/NestedBaseUi";
import S from "./_styled";
import { useVars } from "./useVars";

const Amedist = (props = {}) => {
    const {
        rootRef,
        pastThreshold,
        titleLines,
        parentTitle,
        parentIcon,
        location,
        coverImage,
        quote,
        sliderColor,
    } = useVars(props);

    const hasMeta = Boolean(parentTitle || location);
    const hasQuote = quote != null && quote !== false && quote !== "";

    return (
        <S.container ref={rootRef}>
            <S.coverStage>
                <S.coverLayer $pastThreshold={pastThreshold} aria-hidden="true">
                    {coverImage && (
                        <Image
                            catalogSet={coverImage}
                            alt=""
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            fetchPriority="high"
                        />
                    )}
                </S.coverLayer>

                {titleLines[0] && (
                    <S.title $sliderColor={sliderColor} $pastThreshold={pastThreshold}>
                        <S.titleFirstLine>{titleLines[0]}</S.titleFirstLine>
                        {titleLines[1] && <S.titleSecondLine>{titleLines[1]}</S.titleSecondLine>}
                    </S.title>
                )}
            </S.coverStage>

            <S.contentArea>
                <S.area1 aria-hidden="true" />
                <S.info>
                    {hasMeta && (
                        <S.meta>
                            {parentTitle && (
                                <S.metaItem>
                                    {parentIcon && <Icon icon={parentIcon} width={16} flat />}
                                    {parentTitle}
                                </S.metaItem>
                            )}
                            {location && (
                                <S.metaItem>
                                    <Icon icon="location" width={16} flat />
                                    {location}
                                </S.metaItem>
                            )}
                        </S.meta>
                    )}
                    <S.divider aria-hidden="true" />
                    {hasQuote && (
                        <S.quote>
                            {/* Rich quote JSX (e.g. text + <i>) arrives as a Fragment with multiple
                                children — NestedBaseUi keys that list so React doesn't warn. */}
                            {isValidElement(quote) ? <NestedBaseUi content={quote} /> : quote}
                        </S.quote>
                    )}
                </S.info>
                <S.area3 aria-hidden="true" />
            </S.contentArea>
        </S.container>
    );
};

export default Amedist;

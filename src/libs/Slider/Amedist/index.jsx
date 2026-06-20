import { t } from "../../getText";
import { Button } from "../../Button";
import { Typo } from "../../Typo";
import { Flex } from "../../Flex";
import { useVars } from "./useVars";
import S, { AMEDIST_IMAGE_BASE_MS, AMEDIST_IMAGE_STAGGER_MS } from "./_styled";

const Amedist = (p = {}) => {
    const {
        rootRef,
        timeBarKey,
        durationSec,
        inViewport,
        slideList,
        getSlideImages,
        resolveContentMotion,
        activeIndex,
        prevIndex,
        direction,
        snapLayout,
        resolvedBottomMargin,
        SlideBullet,
        changeSlide,
    } = useVars(p);

    /* Return */
    return (
        <S.root ref={rootRef}>
            <S.timeBarTrack aria-hidden>
                <S.timeBarFill key={timeBarKey} $durationSec={durationSec} $paused={!inViewport} />
            </S.timeBarTrack>
            <S.imageArea>
                <S.slidesLayer>
                    {slideList.map((slide, i) => {
                        const images = getSlideImages(slide.image);
                        if (images.length === 0) return null;

                        const motion = resolveContentMotion(i, activeIndex, prevIndex, direction);

                        return (
                            <S.slideStack key={i} $motion={motion}>
                                {images.map((img, layerIndex) => (
                                    <S.slideBgLayer
                                        key={layerIndex}
                                        $image={img}
                                        $motion={motion}
                                        $layerIndex={layerIndex}
                                        $durationMs={
                                            images.length > 1
                                                ? AMEDIST_IMAGE_BASE_MS +
                                                  layerIndex * AMEDIST_IMAGE_STAGGER_MS
                                                : AMEDIST_IMAGE_BASE_MS
                                        }
                                        $snap={snapLayout}
                                        $paused={!inViewport}
                                    />
                                ))}
                            </S.slideStack>
                        );
                    })}
                </S.slidesLayer>
            </S.imageArea>
            <Flex.column
                width="100%"
                xAlign="center"
                yAlign="top"
                gap={20}
                paddingBottom={resolvedBottomMargin}
            >
                <S.contentWrap aria-live="polite">
                    {slideList.map((slide, i) => (
                        <S.slideContent
                            key={i}
                            $motion={resolveContentMotion(i, activeIndex, prevIndex, direction)}
                            $snap={snapLayout}
                            $paused={!inViewport}
                        >
                            <Flex.column gap={16} xAlign="center" yAlign="top" width="100%">
                                {slide.title != null && slide.title !== "" && (
                                    <S.slideTitle color="foreground" weight={600} lineHeight={1.2}>
                                        {t(slide.title)}
                                    </S.slideTitle>
                                )}
                                {slide.description != null && slide.description !== "" && (
                                    <Typo.p
                                        color="foreground"
                                        size="110%"
                                        lineHeight={1.5}
                                        textAlign="center"
                                    >
                                        {t(slide.description)}
                                    </Typo.p>
                                )}
                                {slide.ctaHref != null && slide.ctaHref !== "" && (
                                    <Button.brackets
                                        label={t(slide.ctaText)}
                                        href={t(slide.ctaHref)}
                                    />
                                )}
                            </Flex.column>
                        </S.slideContent>
                    ))}
                </S.contentWrap>
                <Flex.row
                    gap={5}
                    xAlign="center"
                    yAlign="center"
                    role="tablist"
                    aria-label="Slides"
                >
                    {slideList.map((slide, i) => (
                        <SlideBullet
                            key={i}
                            active={i === activeIndex}
                            onClick={() => changeSlide(i)}
                            label={t(slide.title) || `Slide ${i + 1}`}
                        />
                    ))}
                </Flex.row>
            </Flex.column>
        </S.root>
    );
};

export default Amedist;

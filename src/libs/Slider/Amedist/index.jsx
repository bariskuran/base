import { t } from "../../getText";
import { Button } from "../../Button";
import { Typo } from "../../Typo";
import { useCandle, useVars } from "./useVars.jsx";
import S from "./_styled";

const hasValue = (value) => value != null && value !== "";

const SlideCta = ({ slide }) => {
    if (!hasValue(slide.ctaHref)) return null;
    return <Button.brackets label={t(slide.ctaText)} href={t(slide.ctaHref)} color={slide.color} />;
};

const SlideImageLayer = ({
    img,
    layerIndex,
    motion,
    direction,
    transitioning,
    layerTiming,
    enterMs,
    exitMs,
    snapLayout,
    playbackActive,
    resolveImageFrom,
}) => {
    const candle = useCandle({
        candle: img.candle,
        active: motion === "active" && playbackActive,
    });

    return (
        <S.slideBgLayer
            $motion={motion}
            $from={resolveImageFrom(img, direction)}
            $scale={img.scale}
            $fade={img.fade}
            $transitioning={transitioning}
            $durationMs={layerTiming.durationMs}
            $delayMs={layerTiming.delayMs}
            $enterMs={enterMs}
            $exitMs={exitMs}
            $snap={snapLayout}
            $paused={!playbackActive}
            $layerIndex={layerIndex}
        >
            <S.slideBgImage
                $image={img.src}
                $candleOpacity={candle.opacity}
                $candleTransitionMs={candle.transitionMs}
            />
        </S.slideBgLayer>
    );
};

const Amedist = (p = {}) => {
    const vars = useVars(p);
    if (!vars) return null;

    const {
        rootRef,
        timeBarKey,
        durationSec,
        enterMs,
        exitMs,
        contentTransitionMs,
        inViewport,
        slideList,
        getSlideImages,
        getLayerTiming,
        resolveImageFrom,
        resolveContentMotion,
        resolveCommonCtaMotion,
        getCommonCtaSlide,
        activeIndex,
        prevIndex,
        direction,
        snapLayout,
        resolvedBottomMargin,
        SlideBullet,
        changeSlide,
    } = vars;

    const commonCtaSlide = getCommonCtaSlide(slideList, activeIndex, prevIndex);
    const commonCtaMotion = resolveCommonCtaMotion(slideList, activeIndex, prevIndex, direction);
    const isSlideTransitioning = prevIndex !== activeIndex;

    const renderImageLayer = (slide, img, layerIndex, motion) => {
        const layerTiming = getLayerTiming(slide, layerIndex);

        return (
            <SlideImageLayer
                key={layerIndex}
                img={img}
                layerIndex={layerIndex}
                motion={motion}
                direction={direction}
                transitioning={isSlideTransitioning}
                layerTiming={layerTiming}
                enterMs={enterMs}
                exitMs={exitMs}
                snapLayout={snapLayout}
                playbackActive={inViewport}
                resolveImageFrom={resolveImageFrom}
            />
        );
    };

    const renderSlideImageStack = (slide, i, shouldBringToFront) => {
        const images = getSlideImages(slide.image);
        if (images.length === 0) return null;

        const motion = resolveContentMotion(i, activeIndex, prevIndex, direction);
        const visibleLayers = images
            .map((img, layerIndex) => ({ img, layerIndex }))
            .filter(({ img }) => Boolean(img.bringToFront) === shouldBringToFront);

        if (visibleLayers.length === 0) return null;

        return (
            <S.slideStack key={i} $motion={motion}>
                {visibleLayers.map(({ img, layerIndex }) =>
                    renderImageLayer(slide, img, layerIndex, motion),
                )}
            </S.slideStack>
        );
    };

    return (
        <S.container ref={rootRef}>
            <S.sliderArea>
                <S.slidesLayer>
                    {slideList.map((slide, i) => renderSlideImageStack(slide, i, false))}
                </S.slidesLayer>
            </S.sliderArea>
            <S.frontSlidesLayer>
                {slideList.map((slide, i) => renderSlideImageStack(slide, i, true))}
            </S.frontSlidesLayer>
            <S.contentArea $bottomMargin={resolvedBottomMargin}>
                <S.area1 />
                <S.sliderInfo aria-live="polite">
                    <S.topBarArea aria-hidden>
                        <S.topBarFill
                            key={timeBarKey}
                            $durationSec={durationSec}
                            $paused={!inViewport}
                        />
                    </S.topBarArea>
                    <S.sliderContent>
                        <S.infoArea>
                            <S.contentWrap>
                                {slideList.map((slide, i) => {
                                    const motion = resolveContentMotion(
                                        i,
                                        activeIndex,
                                        prevIndex,
                                        direction,
                                    );
                                    const hasSlideCta =
                                        slide._ctaSource === "slide" && hasValue(slide.ctaHref);

                                    return (
                                        <S.slideContent
                                            key={i}
                                            $motion={motion}
                                            $enterMs={contentTransitionMs}
                                            $exitMs={contentTransitionMs}
                                            $snap={snapLayout}
                                            $paused={!inViewport}
                                        >
                                            {hasValue(slide.title) && (
                                                <Typo.h4
                                                    marginBottom={30}
                                                    color={slide.color || "foreground"}
                                                    weight={400}
                                                    balance
                                                >
                                                    {t(slide.title)}
                                                </Typo.h4>
                                            )}
                                            {hasValue(slide.description) && (
                                                <Typo.p color={slide.color || "foreground"} balance>
                                                    {t(slide.description)}
                                                </Typo.p>
                                            )}
                                            {hasSlideCta && <SlideCta slide={slide} />}
                                        </S.slideContent>
                                    );
                                })}
                                {commonCtaSlide && (
                                    <S.commonContent
                                        $motion={commonCtaMotion}
                                        $enterMs={contentTransitionMs}
                                        $exitMs={contentTransitionMs}
                                        $snap={snapLayout}
                                        $paused={!inViewport}
                                    >
                                        <SlideCta slide={commonCtaSlide} />
                                    </S.commonContent>
                                )}
                            </S.contentWrap>
                        </S.infoArea>
                        <S.bullets role="tablist" aria-label="Slides">
                            {slideList.map((slide, i) => (
                                <SlideBullet
                                    key={i}
                                    active={i === activeIndex}
                                    onClick={() => changeSlide(i)}
                                    label={t(slide.title) || `Slide ${i + 1}`}
                                />
                            ))}
                        </S.bullets>
                    </S.sliderContent>
                </S.sliderInfo>
                <S.area3 />
            </S.contentArea>
        </S.container>
    );
};

export default Amedist;

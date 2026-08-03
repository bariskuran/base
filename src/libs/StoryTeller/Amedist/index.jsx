import { Button } from "../../Button";
import { slideDesigns } from "../slideDesigns";
import { S } from "./_styled";
import { useVars } from "./useVars";

const Amedist = (props = {}) => {
    const vars = useVars(props);
    const {
        rootRef,
        activeStory,
        activeIndex,
        preloadStories,
        slideNumber,
        slideCount,
        direction,
        canGoPrevious,
        canGoNext,
        canFullscreen,
        isFullscreen,
        close,
        goPrevious,
        goNext,
        handleActiveImageLoad,
        toggleFullscreen,
    } = vars;

    if (!activeStory) return null;
    const ActiveSlideDesign = slideDesigns[activeStory.slideDesign];

    return (
        <S.container ref={rootRef} aria-roledescription="storyteller">
            <S.slideLayer key={slideNumber} $direction={direction} aria-live="polite">
                {ActiveSlideDesign && (
                    <ActiveSlideDesign
                        story={activeStory}
                        index={activeIndex}
                        slideNumber={slideNumber}
                        slideCount={slideCount}
                        onImageLoad={handleActiveImageLoad}
                    />
                )}
            </S.slideLayer>
            {preloadStories.map(({ story, index }) => {
                const PreloadSlideDesign = slideDesigns[story.slideDesign];
                if (!PreloadSlideDesign) return null;

                return (
                    <S.preloadLayer
                        key={index}
                        aria-hidden="true"
                        inert={true}
                        data-storyteller-preload={index + 1}
                    >
                        <PreloadSlideDesign
                            story={story}
                            index={index}
                            slideNumber={index + 1}
                            slideCount={slideCount}
                        />
                    </S.preloadLayer>
                );
            })}
            <S.controls aria-label="Story controls">
                {canGoPrevious && (
                    <S.previous data-storyteller-control="previous">
                        <Button.plain
                            primary
                            size={150}
                            skipClickCooldown
                            skipOnClickHold
                            onClick={goPrevious}
                            icon={{ icon: "fullArrowLeft", flat: true }}
                        />
                    </S.previous>
                )}
                <S.close data-storyteller-control="close">
                    {canFullscreen && (
                        <Button.plain
                            primary
                            activeManually={isFullscreen}
                            skipClickCooldown
                            skipOnClickHold
                            onClick={toggleFullscreen}
                            icon={{ icon: "expand", flat: true }}
                        />
                    )}
                    <Button.plain
                        primary
                        skipClickCooldown
                        skipOnClickHold
                        onClick={close}
                        icon={{ icon: "close", flat: true }}
                    />
                </S.close>
                {canGoNext && (
                    <S.next data-storyteller-control="next">
                        <Button.plain
                            primary
                            size={150}
                            skipClickCooldown
                            skipOnClickHold
                            onClick={goNext}
                            icon={{ icon: "fullArrowRight", flat: true }}
                        />
                    </S.next>
                )}
            </S.controls>
        </S.container>
    );
};

export default Amedist;

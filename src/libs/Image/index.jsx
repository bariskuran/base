import { S } from "./_styled";
import { useVars } from "./useVars";

export const Image = ({
    src,
    externalSet,
    catalogSet,
    alt,
    variant,
    responsive = true,
    progressive = true,
    loadInViewport = false,
    loadingAnimation = "pulse",
    placeholderAnimation,
    fetchPriority = "auto",
    w,
    h,
    width,
    height,
    objectFit,
    onLoad,
    style,
    ...rest
}) => {
    const {
        wrapperRef,
        imgSrc,
        selectedAlt,
        handleLoad,
        isLoaded,
        shouldShowImg,
        shouldShowPlaceholder,
        aspectRatio,
        objectFit: resolvedObjectFit,
    } = useVars({
        src,
        externalSet,
        catalogSet,
        alt,
        variant,
        responsive,
        progressive,
        loadInViewport,
        loadingAnimation: loadingAnimation ?? placeholderAnimation,
        fetchPriority,
        w,
        h,
        width,
        height,
        onLoad,
    });

    return (
        <S.wrapper
            ref={wrapperRef}
            style={style}
            $width={width ?? w ?? "100%"}
            $height={height ?? h ?? "auto"}
            $aspectRatio={aspectRatio}
            $showPlaceholder={shouldShowPlaceholder}
            $loadingAnimation={
                loadingAnimation === false || loadingAnimation === "none" ? "none" : loadingAnimation
            }
        >
            {shouldShowImg && (
                <S.img
                    {...rest}
                    src={imgSrc}
                    alt={selectedAlt}
                    fetchPriority={fetchPriority}
                    onLoad={handleLoad}
                    $loaded={isLoaded}
                    $heightAuto={(height ?? h ?? "auto") === "auto"}
                    $objectFit={objectFit || resolvedObjectFit}
                />
            )}
        </S.wrapper>
    );
};

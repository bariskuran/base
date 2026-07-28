import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Button } from "../../Button";
import { Image } from "../../Image";
import { PopUp } from "../../PopUp";
import { ScrollFlex } from "../../ScrollFlex";
import { t } from "../../getText";
import S from "./_styled";

const controlIcons = {
    close: "close",
    previous: "arrowLeft",
    next: "arrowRight",
};

/** Enter scroll mode when content exceeds viewport by this many px. */
const SCROLL_ENTER_PX = 1;
/**
 * Leave scroll mode only when content clearly fits (hysteresis).
 * Prevents ScrollFlex ↔ centered row flip-flop while images decode / scrollbar gutter shifts.
 */
const SCROLL_EXIT_SLACK_PX = 48;

const toCssLength = (value) => (typeof value === "number" ? `${value}rem` : value);
const toRemNumber = (value) => {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : 0;
};

const normalizeAlignX = (alignX) => {
    if (alignX === "start" || alignX === "left") return "start";
    if (alignX === "end" || alignX === "right") return "end";
    return "center";
};

const Control = ({ label, onClick, position }) => (
    <S.control $position={position}>
        <Button.plain
            primary
            ariaLabel={label}
            skipClickCooldown
            skipOnClickHold
            onClick={onClick}
            icon={{
                icon: controlIcons[position],
                width: 16,
                flat: true,
            }}
        />
    </S.control>
);

const Thumbnail = ({ image, index, thumbnailHeight, onSelect }) => (
    <S.thumbnail
        type="button"
        $height={thumbnailHeight}
        onClick={(event) => {
            onSelect(index);
            event.currentTarget.blur();
        }}
        aria-label={`${image.alt ? t(image.alt) : "Image"} ${index + 1}`}
    >
        <Image
            {...image.thumbnail}
            alt={image.alt}
            h={`${thumbnailHeight}rem`}
            w="auto"
            objectFit="cover"
            responsive={false}
            progressive={false}
            loadInViewport
        />
    </S.thumbnail>
);

const Amedist = ({
    images,
    selectedIndex,
    selectedImage,
    isOpen,
    canGoPrevious,
    canGoNext,
    onSelect,
    onClose,
    onPrevious,
    onNext,
    thumbnailHeight = 150,
    gap = 10,
    marginToEdge = 150,
    alignX = "center",
    className,
}) => {
    const rootRef = useRef(null);
    const measureRowRef = useRef(null);
    const needsScrollRef = useRef(false);
    const measureRafRef = useRef(null);
    const [needsScroll, setNeedsScroll] = useState(false);

    const edgeSpacerWidth = `max(0px, calc(${toRemNumber(marginToEdge)}px - ${toCssLength(gap)}))`;
    const caption = selectedImage?.alt != null && selectedImage.alt !== "" ? t(selectedImage.alt) : "";
    const resolvedAlignX = normalizeAlignX(alignX);

    const applyNeedsScroll = useCallback((next) => {
        if (needsScrollRef.current === next) return;
        needsScrollRef.current = next;
        setNeedsScroll(next);
    }, []);

    const remeasure = useCallback(() => {
        if (measureRafRef.current != null) return;

        measureRafRef.current = requestAnimationFrame(() => {
            measureRafRef.current = null;

            const root = rootRef.current;
            const row = measureRowRef.current;
            if (!root || !row) return;

            const contentWidth = row.scrollWidth;
            const viewportWidth = root.clientWidth;
            const prev = needsScrollRef.current;

            // Hysteresis: once scrolling, stay until content clearly fits again.
            const next = prev
                ? contentWidth > viewportWidth - SCROLL_EXIT_SLACK_PX
                : contentWidth > viewportWidth + SCROLL_ENTER_PX;

            applyNeedsScroll(next);
        });
    }, [applyNeedsScroll]);

    useLayoutEffect(() => {
        needsScrollRef.current = false;
        applyNeedsScroll(false);
        remeasure();

        const root = rootRef.current;
        const row = measureRowRef.current;
        if (!root || !row || typeof ResizeObserver === "undefined") {
            if (typeof window !== "undefined") {
                window.addEventListener("resize", remeasure);
                return () => window.removeEventListener("resize", remeasure);
            }
            return undefined;
        }

        const ro = new ResizeObserver(remeasure);
        ro.observe(root);
        ro.observe(row);
        window.addEventListener("resize", remeasure);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", remeasure);
            if (measureRafRef.current != null) {
                cancelAnimationFrame(measureRafRef.current);
                measureRafRef.current = null;
            }
        };
    }, [remeasure, applyNeedsScroll, images, thumbnailHeight, gap]);

    const thumbnails = images.map((image, index) => (
        <Thumbnail
            key={image.key}
            image={image}
            index={index}
            thumbnailHeight={thumbnailHeight}
            onSelect={onSelect}
        />
    ));

    return (
        <S.root ref={rootRef} className={className} data-component="ImageGalery">
            <S.measureHost aria-hidden="true">
                <S.measureRow ref={measureRowRef} $gap={gap} $height={thumbnailHeight}>
                    {images.map((image) => (
                        <S.thumbnail
                            key={`measure-${image.key}`}
                            type="button"
                            $height={thumbnailHeight}
                            tabIndex={-1}
                        >
                            <Image
                                {...image.thumbnail}
                                alt=""
                                h={`${thumbnailHeight}rem`}
                                w="auto"
                                objectFit="cover"
                                responsive={false}
                                progressive={false}
                                loadInViewport={false}
                            />
                        </S.thumbnail>
                    ))}
                </S.measureRow>
            </S.measureHost>

            {needsScroll ? (
                <ScrollFlex.plain
                    width="100%"
                    height={thumbnailHeight + 20}
                    autoWidth={false}
                    autoHeight={false}
                    enableDragging
                    flexProps={{
                        gap,
                        wrap: false,
                        xAlign: "start",
                        yAlign: "stretch",
                        style: {
                            width: "max-content",
                            minWidth: "max-content",
                            maxWidth: "none",
                            boxSizing: "border-box",
                            overflowAnchor: "none",
                        },
                    }}
                    scrollBarProps={{
                        disableY: true,
                        fillMode: false,
                        thickness: 3,
                        trackMargin: toRemNumber(marginToEdge),
                        edgeMargin: 0,
                        edgeMarginX: 0,
                        disableOpacityEffect: true,
                    }}
                >
                    <S.edgeSpacer aria-hidden="true" $width={edgeSpacerWidth} />
                    {thumbnails}
                    <S.edgeSpacer aria-hidden="true" $width={edgeSpacerWidth} />
                </ScrollFlex.plain>
            ) : (
                <S.alignedRow $gap={gap} $height={thumbnailHeight} $alignX={resolvedAlignX}>
                    {thumbnails}
                </S.alignedRow>
            )}

            <PopUp
                open={isOpen}
                onClose={onClose}
                hideCloseButton
                useScrollFlex={false}
                style={{
                    width: "calc(100vw - 50rem)",
                    height: "calc(100vh - 50rem)",
                    maxWidth: "calc(100vw - 50rem)",
                    maxHeight: "calc(100vh - 50rem)",
                    borderRadius: 0,
                }}
                bodyProps={{
                    style: {
                        flex: "1 1 auto",
                        height: "100%",
                        maxHeight: "none",
                        padding: 0,
                    },
                }}
            >
                <S.stage>
                    {selectedImage && (
                        <Image
                            {...selectedImage.full}
                            alt={selectedImage.alt}
                            w="100%"
                            h="100%"
                            objectFit="contain"
                            responsive
                            progressive
                            fetchPriority="high"
                        />
                    )}
                    {caption ? <S.caption>{caption}</S.caption> : null}
                    <Control label="Close gallery" onClick={onClose} position="close" />
                    {canGoPrevious && (
                        <Control label="Previous image" onClick={onPrevious} position="previous" />
                    )}
                    {canGoNext && <Control label="Next image" onClick={onNext} position="next" />}
                    <S.counter>
                        {selectedIndex + 1} / {images.length}
                    </S.counter>
                </S.stage>
            </PopUp>
        </S.root>
    );
};

export default Amedist;

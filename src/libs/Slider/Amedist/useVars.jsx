import { baseStore } from "../../baseStore";
import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import { useObserver } from "../../useObserver";
import { useTimer } from "../../useTimer";
import S from "./_styled";

const BULLET_INACTIVE = 8;
const BULLET_ACTIVE = 28;
const BULLET_H = 8;
const DEFAULT_BOTTOM_MARGIN = 40;
const MIN_SEC_PER_SLIDE = 2;
const CONTENT_TRANSITION_MS = 500;
const DEFAULT_ITEM_ANIMATION_SEC = 0.5;
const CANDLE_MIN_TRANSITION_MS = 100;
const CANDLE_MAX_TRANSITION_MS = 500;

const isEditableTarget = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
};

const toFiniteNumber = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
};

const randomCandleTransitionMs = () =>
    Math.round(
        CANDLE_MIN_TRANSITION_MS +
            Math.random() * (CANDLE_MAX_TRANSITION_MS - CANDLE_MIN_TRANSITION_MS),
    );

export const useCandle = ({ candle, active }) => {
    const numericCandle = toFiniteNumber(candle);
    const candleOpacity = numericCandle == null ? null : Math.min(Math.max(numericCandle, 0), 1);
    const enabled = active && candleOpacity != null && candleOpacity < 1;
    const [state, setState] = useState({ opacity: 1, transitionMs: 0 });

    useEffect(() => {
        if (!enabled) {
            setState({ opacity: 1, transitionMs: 0 });
            return undefined;
        }

        let timer;
        let nextOpacity = candleOpacity;

        const pulse = () => {
            const transitionMs = randomCandleTransitionMs();
            setState({ opacity: nextOpacity, transitionMs });
            nextOpacity = nextOpacity === 1 ? candleOpacity : 1;
            timer = window.setTimeout(pulse, transitionMs);
        };

        pulse();
        return () => window.clearTimeout(timer);
    }, [candleOpacity, enabled]);

    return state;
};

const clampSec = (value, max) => Math.min(Math.max(value, 0), max);

const firstFinite = (...values) => {
    for (const value of values) {
        const numeric = toFiniteNumber(value);
        if (numeric != null) return numeric;
    }
    return null;
};

const getTimingValue = ({ image, slide, context, key, aliases = [] }) =>
    firstFinite(
        image?.[key],
        ...aliases.map((alias) => image?.[alias]),
        slide?.[key],
        ...aliases.map((alias) => slide?.[alias]),
        context?.[key],
        ...aliases.map((alias) => context?.[alias]),
    );

export const resolveSlideImageTiming = (slide, context = {}) => {
    const images = getSlideImages(slide?.image);
    const count = Math.max(1, images.length);
    const maxSlideSec = Math.max(
        MIN_SEC_PER_SLIDE,
        toFiniteNumber(slide?.slideDurationSec) ?? context.slideDurationSec ?? MIN_SEC_PER_SLIDE,
    );
    const defaultItemDurationSec = maxSlideSec / count;

    const layers = images.map((image) => {
        const rawItemDurationSec = getTimingValue({
            image,
            slide,
            context,
            key: "itemDurationSec",
        });
        const itemDurationSec = clampSec(rawItemDurationSec ?? defaultItemDurationSec, maxSlideSec);
        const rawItemAnimationSec = getTimingValue({
            image,
            slide,
            context,
            key: "itemAnimationSec",
        });
        const rawItemCrossFadeSec = getTimingValue({
            image,
            slide,
            context,
            key: "itemCrossFadeSec",
        });

        return {
            itemDurationSec,
            rawItemAnimationSec,
            rawItemCrossFadeSec,
        };
    });

    if (layers.length === 0) {
        return {
            totalMs: Math.round(DEFAULT_ITEM_ANIMATION_SEC * 1000),
            layers: [],
        };
    }

    const requestedDurationSec = layers.reduce((total, layer) => total + layer.itemDurationSec, 0);
    const durationScale =
        requestedDurationSec > maxSlideSec && requestedDurationSec > 0
            ? maxSlideSec / requestedDurationSec
            : 1;

    const constrainedLayers = layers.map((layer) => {
        const itemDurationSec = layer.itemDurationSec * durationScale;
        const itemAnimationSec = clampSec(
            layer.rawItemAnimationSec ?? DEFAULT_ITEM_ANIMATION_SEC,
            itemDurationSec,
        );
        const itemCrossFadeSec = clampSec(
            layer.rawItemCrossFadeSec ?? itemDurationSec * 0.25,
            itemDurationSec,
        );

        return {
            itemDurationSec,
            itemAnimationSec,
            itemCrossFadeSec,
        };
    });

    let cursorSec = 0;
    const timedLayers = constrainedLayers.map((layer, index) => {
        const delaySec = index === 0 ? 0 : cursorSec;
        cursorSec += Math.max(layer.itemDurationSec - layer.itemCrossFadeSec, 0);

        return {
            ...layer,
            delaySec,
            endSec: delaySec + layer.itemAnimationSec,
        };
    });

    const totalSec = Math.max(...timedLayers.map((layer) => layer.endSec), 0);

    return {
        totalMs: Math.round(totalSec * 1000),
        layers: timedLayers.map((layer) => ({
            durationMs: Math.round(layer.itemAnimationSec * 1000),
            delayMs: Math.round(layer.delaySec * 1000),
        })),
    };
};

const VALID_IMAGE_FROM = ["default", "left", "right", "opposite", "center"];

const normalizeMotionFrom = (image) => {
    if (VALID_IMAGE_FROM.includes(image.from)) return image.from;
    if (image.direction === "left" || image.direction === "right") return image.direction;
    if (image.center) return "center";
    if (image.opposite) return "opposite";
    return "default";
};

const normalizeImageLayer = (image) => {
    if (!image) return null;

    if (typeof image === "object" && !Array.isArray(image)) {
        const src = image.im || image.src || image.file;
        if (!src) return null;

        const from = normalizeMotionFrom(image);
        const legacyCenter = !image.from && image.center === true;

        return {
            src,
            from,
            scale: image.scale != null ? Boolean(image.scale) : legacyCenter,
            fade: image.fade != null ? Boolean(image.fade) : true,
            bringToFront: Boolean(image.bringToFront),
            candle: image.candle,
            slideDurationSec: image.slideDurationSec,
            itemDurationSec: image.itemDurationSec,
            itemAnimationSec: image.itemAnimationSec,
            itemCrossFadeSec: image.itemCrossFadeSec,
        };
    }

    return {
        src: image,
        from: "default",
        scale: false,
        fade: true,
        bringToFront: false,
        candle: null,
    };
};

const getSlideImages = (image) => {
    if (!image) return [];
    const images = Array.isArray(image) ? image : [image];
    return images.map(normalizeImageLayer).filter((img) => img?.src);
};

const resolveImageFrom = (image, direction) => {
    if (image?.from === "left" || image?.from === "right" || image?.from === "center") {
        return image.from;
    }

    const shouldFlip = image?.from === "opposite";
    const fromRight = direction > 0 ? !shouldFlip : shouldFlip;
    return fromRight ? "right" : "left";
};

const getSlideImageAnimMs = (slide, timingContext) =>
    resolveSlideImageTiming(slide, timingContext).totalMs;

const computeDirection = (from, to, count) => {
    if (from === to || count <= 1) return 1;
    const forward = (to - from + count) % count;
    const backward = (from - to + count) % count;
    return forward <= backward ? 1 : -1;
};

const resolveContentMotion = (index, activeIndex, prevIndex, direction) => {
    if (index === activeIndex) return "active";
    if (index === prevIndex && prevIndex !== activeIndex) {
        return direction > 0 ? "exit-forward" : "exit-backward";
    }
    if (prevIndex !== activeIndex) {
        return direction > 0 ? "hidden-right" : "hidden-left";
    }
    return "hidden-right";
};

const hasValue = (value) => value != null && value !== "";

const getSlideField = (slide, slideCommons, key) => {
    if (hasValue(slide?.[key])) return slide[key];
    return slideCommons?.[key];
};

const hasOwnCta = (slide) => hasValue(slide?.ctaHref) || hasValue(slide?.ctaText);

const stringifyCtaValue = (value) => {
    if (!hasValue(value)) return "";
    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }
    return String(value);
};

const getCtaKey = (item) => {
    if (!hasValue(item?.ctaHref) && !hasValue(item?.ctaText)) return "";
    return `${stringifyCtaValue(item?.ctaHref)}|${stringifyCtaValue(item?.ctaText)}`;
};

const makeResolvedSlides = (slides, slideCommons) =>
    slides.map((slide) => {
        const slideHasOwnCta = hasOwnCta(slide);
        const commonCtaKey = getCtaKey(slideCommons);
        const slideCtaKey = getCtaKey(slide);

        return {
            ...slide,
            title: getSlideField(slide, slideCommons, "title"),
            description: getSlideField(slide, slideCommons, "description"),
            ctaHref: getSlideField(slide, slideCommons, "ctaHref"),
            ctaText: getSlideField(slide, slideCommons, "ctaText"),
            _ctaSource: slideHasOwnCta ? "slide" : "common",
            _commonCtaKey: slideHasOwnCta ? "" : commonCtaKey,
            _slideCtaKey: slideHasOwnCta ? slideCtaKey : "",
        };
    });

const getCommonCtaSlide = (slideList, activeIndex, prevIndex) => {
    const activeSlide = slideList[activeIndex];
    if (activeSlide?._ctaSource === "common" && hasValue(activeSlide.ctaHref)) return activeSlide;

    const prevSlide = slideList[prevIndex];
    if (prevSlide?._ctaSource === "common" && hasValue(prevSlide.ctaHref)) return prevSlide;

    return slideList.find((slide) => slide?._ctaSource === "common" && hasValue(slide.ctaHref));
};

const resolveCommonCtaMotion = (slideList, activeIndex, prevIndex, direction) => {
    const activeSlide = slideList[activeIndex];
    const prevSlide = slideList[prevIndex];

    if (activeSlide?._ctaSource === "common") {
        if (
            prevIndex !== activeIndex &&
            prevSlide?._ctaSource === "common" &&
            prevSlide?._commonCtaKey === activeSlide._commonCtaKey
        ) {
            return "active";
        }
        return "active";
    }

    if (prevSlide?._ctaSource === "common" && prevIndex !== activeIndex) {
        return direction > 0 ? "exit-forward" : "exit-backward";
    }

    return direction > 0 ? "hidden-right" : "hidden-left";
};

const SlideBullet = ({ active, onClick, label }) => {
    const height = active ? BULLET_ACTIVE : BULLET_INACTIVE;

    return (
        <S.bulletButton
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-current={active ? "true" : undefined}
        >
            <S.bulletSvg width={BULLET_H} height={height} viewBox={`0 0 ${BULLET_H} ${height}`}>
                <S.bulletRect
                    $active={active}
                    x={0}
                    y={0}
                    width={BULLET_H}
                    height={height}
                    rx={BULLET_H / 2}
                />
            </S.bulletSvg>
        </S.bulletButton>
    );
};

export const useVars = ({
    slideDurationSec = MIN_SEC_PER_SLIDE,
    itemDurationSec,
    itemAnimationSec = DEFAULT_ITEM_ANIMATION_SEC,
    itemCrossFadeSec,
    slides = [],
    slideCommons = {},
    bottomMargin,
}) => {
    const slideList = useMemo(() => {
        const list = Array.isArray(slides) ? slides.filter(Boolean) : [];
        return makeResolvedSlides(list, slideCommons || {});
    }, [slides, slideCommons]);
    const count = slideList.length;

    const { activeIndex, prevIndex, direction, snapLayout, timeBarKey, set } = baseStore.useLocal({
        activeIndex: 0,
        prevIndex: -1,
        direction: 1,
        snapLayout: false,
        timeBarKey: 0,
    });
    const [isMenuOpen, setGlobalByPath] = baseStore.useGlobal((s) => [s.isMenuOpen, s.setByPath]);

    const { ref: rootRef, inViewport } = useObserver({ threshold: 0.05 });
    const isPlaybackActive = inViewport && !isMenuOpen;

    const rootDurationSec = Math.max(
        MIN_SEC_PER_SLIDE,
        Number(slideDurationSec) || MIN_SEC_PER_SLIDE,
    );
    const resolvedPrevIndex = count <= 1 ? activeIndex : prevIndex === -1 ? count - 1 : prevIndex;
    const activeSlide = slideList[activeIndex];
    const headerBackgroundAlpha = toFiniteNumber(activeSlide?.headerBackgroundAlpha);
    const headerColor = activeSlide?.headerColor || null;
    const durationSec = Math.max(
        MIN_SEC_PER_SLIDE,
        firstFinite(activeSlide?.slideDurationSec, rootDurationSec),
    );
    const durationMs = durationSec * 1000;
    const timingContext = useMemo(
        () => ({
            slideDurationSec: durationSec,
            itemDurationSec,
            itemAnimationSec,
            itemCrossFadeSec,
        }),
        [durationSec, itemAnimationSec, itemCrossFadeSec, itemDurationSec],
    );
    const activeImageTiming = useMemo(
        () => resolveSlideImageTiming(activeSlide, timingContext),
        [activeSlide, timingContext],
    );
    const enterMs = activeImageTiming.totalMs;
    const exitMs = CONTENT_TRANSITION_MS;
    const getLayerTiming = useCallback(
        (slide, layerIndex) =>
            resolveSlideImageTiming(slide, timingContext).layers[layerIndex] || {
                durationMs: enterMs,
                delayMs: 0,
            },
        [enterMs, timingContext],
    );
    const resolvedBottomMargin = bottomMargin != null ? bottomMargin : DEFAULT_BOTTOM_MARGIN;

    useEffect(() => {
        setGlobalByPath("headerBackgroundAlpha", headerBackgroundAlpha);
        setGlobalByPath("headerColor", headerColor);
    }, [headerBackgroundAlpha, headerColor, setGlobalByPath]);

    useEffect(
        () => () => {
            setGlobalByPath("headerBackgroundAlpha", null);
            setGlobalByPath("headerColor", null);
        },
        [setGlobalByPath],
    );

    const countRef = useRef(count);
    const slideListRef = useRef(slideList);
    const durationMsRef = useRef(durationMs);
    const remainingMsRef = useRef(durationMs);
    const timerStartedAtRef = useRef(0);
    const inViewportRef = useRef(true);

    countRef.current = count;
    slideListRef.current = slideList;
    durationMsRef.current = durationMs;
    inViewportRef.current = isPlaybackActive;

    const getDurationMsForIndex = useCallback(
        (index) => {
            const slide = slideListRef.current[index];
            const slideDurationSec = Math.max(
                MIN_SEC_PER_SLIDE,
                firstFinite(slide?.slideDurationSec, rootDurationSec),
            );
            return slideDurationSec * 1000;
        },
        [rootDurationSec],
    );

    const bumpTimeBar = useCallback(() => {
        set((s) => {
            s.timeBarKey += 1;
        });
    }, [set]);

    const snapHandlerRef = useRef(null);

    const { start: startSnapTimer, stop: stopSnapTimer } = useTimer({
        timerName: "amedistSnap",
        loop: false,
        startOnLoad: false,
        onEnd: () => snapHandlerRef.current?.(),
    });

    const beginSlideTimerRef = useRef(null);

    const { start: startSlideTimer, stop: stopSlideTimer } = useTimer({
        timerName: "amedistSlide",
        loop: false,
        startOnLoad: false,
        refreshTime: durationMs,
        onEnd: () => {
            if (countRef.current === 0 || !inViewportRef.current) return;

            let nextDurationMs = durationMsRef.current;

            set((s) => {
                s.prevIndex = s.activeIndex;
                s.direction = 1;
                s.activeIndex = (s.activeIndex + 1) % countRef.current;
                nextDurationMs = getDurationMsForIndex(s.activeIndex);
                s.timeBarKey += 1;
            });

            remainingMsRef.current = nextDurationMs;
            timerStartedAtRef.current = Date.now();
            beginSlideTimerRef.current?.(nextDurationMs);
        },
    });

    const beginSlideTimer = useCallback(
        (ms = durationMsRef.current) => {
            const refreshTime = Math.max(0, ms);
            remainingMsRef.current = refreshTime;
            timerStartedAtRef.current = Date.now();
            startSlideTimer({ refreshTime, loop: false });
        },
        [startSlideTimer],
    );

    beginSlideTimerRef.current = beginSlideTimer;

    const restartSlideTimer = useCallback(
        (ms = durationMsRef.current) => {
            stopSlideTimer();
            bumpTimeBar();
            remainingMsRef.current = ms;
            if (inViewportRef.current) {
                beginSlideTimer(ms);
            }
        },
        [beginSlideTimer, bumpTimeBar, stopSlideTimer],
    );

    const changeSlide = useCallback(
        (nextIndex) => {
            if (count === 0) return;
            const normalized = ((nextIndex % count) + count) % count;

            set((s) => {
                if (s.activeIndex === normalized) return;
                s.prevIndex = s.activeIndex;
                s.direction = computeDirection(s.activeIndex, normalized, count);
                s.activeIndex = normalized;
            });

            restartSlideTimer(getDurationMsForIndex(normalized));
        },
        [count, getDurationMsForIndex, restartSlideTimer, set],
    );

    useEffect(() => {
        if (!isPlaybackActive || count <= 1) return undefined;

        const onKeyDown = (event) => {
            if (
                event.defaultPrevented ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey
            )
                return;
            if (isEditableTarget(event.target)) return;
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

            event.preventDefault();
            changeSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [activeIndex, changeSlide, count, isPlaybackActive]);

    useEffect(() => {
        if (resolvedPrevIndex === activeIndex) return undefined;
        if (!isPlaybackActive) {
            stopSnapTimer();
            return undefined;
        }

        const snapMs = Math.max(exitMs, getSlideImageAnimMs(activeSlide, timingContext));

        snapHandlerRef.current = () => {
            set((s) => {
                const wasInitialSnap = s.prevIndex === -1;
                s.snapLayout = true;
                s.prevIndex = s.activeIndex;
                if (wasInitialSnap) s.timeBarKey += 1;
            });
            requestAnimationFrame(() => {
                set((s) => {
                    s.snapLayout = false;
                });
            });
        };

        stopSnapTimer();
        startSnapTimer({ refreshTime: snapMs, loop: false });

        return () => stopSnapTimer();
    }, [
        activeIndex,
        activeSlide,
        enterMs,
        exitMs,
        resolvedPrevIndex,
        isPlaybackActive,
        slideList,
        timingContext,
        set,
        startSnapTimer,
        stopSnapTimer,
    ]);

    useEffect(() => {
        if (count === 0) return undefined;

        if (prevIndex === -1 && count > 1) {
            stopSlideTimer();
            return undefined;
        }

        if (isPlaybackActive) {
            beginSlideTimer(remainingMsRef.current);
        } else {
            const elapsed = Date.now() - timerStartedAtRef.current;
            remainingMsRef.current = Math.max(0, remainingMsRef.current - elapsed);
            stopSlideTimer();
        }

        return () => stopSlideTimer();
    }, [isPlaybackActive, count, prevIndex, beginSlideTimer, stopSlideTimer]);

    if (count === 0) return null;

    /* Return */
    return {
        rootRef,
        timeBarKey,
        durationSec,
        enterMs,
        exitMs,
        contentTransitionMs: CONTENT_TRANSITION_MS,
        inViewport: isPlaybackActive,
        slideList,
        getSlideImages,
        getLayerTiming,
        resolveImageFrom,
        resolveContentMotion,
        resolveCommonCtaMotion,
        getCommonCtaSlide,
        activeIndex,
        prevIndex: resolvedPrevIndex,
        direction,
        snapLayout,
        resolvedBottomMargin,
        SlideBullet,
        changeSlide,
    };
};

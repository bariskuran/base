import { baseStore } from "../../baseStore";
import { useMemo, useRef, useEffect, useCallback } from "react";
import { useObserver } from "../../useObserver";
import { useTimer } from "../../useTimer";
import S, { AMEDIST_IMAGE_BASE_MS, AMEDIST_IMAGE_STAGGER_MS, AMEDIST_TEXT_MS } from "./_styled";

const BULLET_INACTIVE = 8;
const BULLET_ACTIVE = 28;
const BULLET_H = 8;
const DEFAULT_BOTTOM_MARGIN = 40;

const getSlideImages = (image) => {
    if (!image) return [];
    return Array.isArray(image) ? image.filter(Boolean) : [image];
};

const getSlideImageAnimMs = (image) => {
    const layers = getSlideImages(image);
    if (layers.length <= 1) return AMEDIST_IMAGE_BASE_MS;
    return AMEDIST_IMAGE_BASE_MS + (layers.length - 1) * AMEDIST_IMAGE_STAGGER_MS;
};

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

const SlideBullet = ({ active, onClick, label }) => {
    const width = active ? BULLET_ACTIVE : BULLET_INACTIVE;

    return (
        <S.bulletButton
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-current={active ? "true" : undefined}
        >
            <S.bulletSvg width={width} height={BULLET_H} viewBox={`0 0 ${width} ${BULLET_H}`}>
                <S.bulletRect
                    $active={active}
                    x={0}
                    y={0}
                    width={width}
                    height={BULLET_H}
                    rx={BULLET_H / 2}
                />
            </S.bulletSvg>
        </S.bulletButton>
    );
};

export const useVars = ({ secPerSlide = 5, slides = [], bottomMargin }) => {
    const slideList = useMemo(
        () => (Array.isArray(slides) ? slides.filter(Boolean) : []),
        [slides],
    );
    const count = slideList.length;

    const { activeIndex, prevIndex, direction, snapLayout, timeBarKey, set } = baseStore.useLocal({
        activeIndex: 0,
        prevIndex: 0,
        direction: 1,
        snapLayout: false,
        timeBarKey: 0,
    });

    const { ref: rootRef, inViewport } = useObserver({ threshold: 0.05 });

    const durationSec = Math.max(0.5, Number(secPerSlide) || 5);
    const durationMs = durationSec * 1000;
    const resolvedBottomMargin = bottomMargin != null ? bottomMargin : DEFAULT_BOTTOM_MARGIN;

    const countRef = useRef(count);
    const durationMsRef = useRef(durationMs);
    const remainingMsRef = useRef(durationMs);
    const timerStartedAtRef = useRef(0);
    const inViewportRef = useRef(true);

    countRef.current = count;
    durationMsRef.current = durationMs;
    inViewportRef.current = inViewport;

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

            set((s) => {
                s.prevIndex = s.activeIndex;
                s.direction = 1;
                s.activeIndex = (s.activeIndex + 1) % countRef.current;
                s.timeBarKey += 1;
            });

            remainingMsRef.current = durationMsRef.current;
            timerStartedAtRef.current = Date.now();
            beginSlideTimerRef.current?.(durationMsRef.current);
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

    const restartSlideTimer = useCallback(() => {
        stopSlideTimer();
        bumpTimeBar();
        remainingMsRef.current = durationMsRef.current;
        if (inViewportRef.current) {
            beginSlideTimer(durationMsRef.current);
        }
    }, [beginSlideTimer, bumpTimeBar, stopSlideTimer]);

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

            restartSlideTimer();
        },
        [count, restartSlideTimer, set],
    );

    useEffect(() => {
        if (prevIndex === activeIndex) return undefined;

        const activeSlide = slideList[activeIndex];
        const snapMs = Math.max(AMEDIST_TEXT_MS, getSlideImageAnimMs(activeSlide?.image));

        snapHandlerRef.current = () => {
            set((s) => {
                s.snapLayout = true;
                s.prevIndex = s.activeIndex;
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
    }, [activeIndex, prevIndex, slideList, set, startSnapTimer, stopSnapTimer]);

    useEffect(() => {
        if (count === 0) return undefined;

        if (inViewport) {
            beginSlideTimer(remainingMsRef.current);
        } else {
            const elapsed = Date.now() - timerStartedAtRef.current;
            remainingMsRef.current = Math.max(0, remainingMsRef.current - elapsed);
            stopSlideTimer();
        }

        return () => stopSlideTimer();
    }, [inViewport, count, beginSlideTimer, stopSlideTimer]);

    if (count === 0) return null;

    /* Return */
    return {
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
    };
};

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../Layout";
import { useManageSearchParams } from "../../useSearchParams";

const SEARCH_PARAM_OPTIONS = {
    setDefaultsOnMount: false,
    disableBase64: true,
    disableTypeControl: true,
    replace: true,
};

const isEditableTarget = (target) => {
    if (!target || typeof target !== "object") return false;
    const tagName = target.tagName?.toLowerCase();
    return (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable
    );
};

export const normalizeSlideNumber = (value, slideCount) => {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > slideCount) return 1;
    return number;
};

export const useVars = ({ stories = [] } = {}) => {
    const storyList = Array.isArray(stories) ? stories : [];
    const slideCount = storyList.length;
    const navigate = useNavigate();
    const rootRef = useRef(null);
    const layoutSourceRef = useRef(Symbol("StoryTeller.amedist"));
    const previousSlideNumberRef = useRef(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loadedSlideNumber, setLoadedSlideNumber] = useState(null);
    const [searchParams, setSearchParams] = useManageSearchParams(SEARCH_PARAM_OPTIONS);
    const [headerController, footerController] = useLayout(["headerAmedist", "footerAmedist"]);

    const slideNumber = slideCount > 0 ? normalizeSlideNumber(searchParams.slide, slideCount) : 0;
    const activeIndex = slideNumber > 0 ? slideNumber - 1 : -1;
    const activeStory = activeIndex >= 0 ? storyList[activeIndex] : null;
    const direction = slideNumber < previousSlideNumberRef.current ? "backward" : "forward";
    const canGoPrevious = slideNumber > 1;
    const canGoNext = slideNumber > 0 && slideNumber < slideCount;
    const nextIndex = canGoNext ? activeIndex + 1 : -1;
    const nextStory = nextIndex >= 0 ? storyList[nextIndex] : null;
    const shouldPreloadNext =
        Boolean(nextStory) && (!activeStory?.image || loadedSlideNumber === slideNumber);
    const canFullscreen =
        typeof document !== "undefined" &&
        typeof document.documentElement?.requestFullscreen === "function";

    useEffect(() => {
        if (slideCount < 1) return;
        const numberFromUrl = Number(searchParams.slide);
        const isValid =
            Number.isInteger(numberFromUrl) && numberFromUrl >= 1 && numberFromUrl <= slideCount;
        if (isValid) return;

        setSearchParams((current) => ({ ...current, slide: 1 }));
    }, [searchParams.slide, setSearchParams, slideCount]);

    useEffect(() => {
        previousSlideNumberRef.current = slideNumber;
    }, [slideNumber]);

    useEffect(() => {
        if (slideCount < 1) return undefined;
        const source = layoutSourceRef.current;
        headerController.hideHeader?.(source);
        footerController.hideFooter?.(source);

        return () => {
            headerController.showHeader?.(source);
            footerController.showFooter?.(source);
        };
    }, [
        footerController.hideFooter,
        footerController.showFooter,
        headerController.hideHeader,
        headerController.showHeader,
        slideCount,
    ]);

    useEffect(() => {
        if (typeof document === "undefined") return undefined;
        const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
        onFullscreenChange();
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    const goToSlide = useCallback(
        (nextSlideNumber) => {
            if (nextSlideNumber < 1 || nextSlideNumber > slideCount) return;
            setSearchParams((current) => ({ ...current, slide: nextSlideNumber }));
        },
        [setSearchParams, slideCount],
    );

    const goPrevious = useCallback(() => goToSlide(slideNumber - 1), [goToSlide, slideNumber]);
    const goNext = useCallback(() => goToSlide(slideNumber + 1), [goToSlide, slideNumber]);
    const handleActiveImageLoad = useCallback(
        () => setLoadedSlideNumber(slideNumber),
        [slideNumber],
    );

    useEffect(() => {
        if (slideCount <= 1) return undefined;

        const onKeyDown = (event) => {
            if (
                event.defaultPrevented ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                isEditableTarget(event.target)
            )
                return;

            if (event.key === "ArrowLeft" && canGoPrevious) {
                event.preventDefault();
                goPrevious();
            }
            if (event.key === "ArrowRight" && canGoNext) {
                event.preventDefault();
                goNext();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [canGoNext, canGoPrevious, goNext, goPrevious, slideCount]);

    const toggleFullscreen = useCallback(async () => {
        if (!canFullscreen || typeof document === "undefined") return;
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await rootRef.current?.requestFullscreen?.();
        } catch {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }
    }, [canFullscreen]);

    const close = useCallback(async () => {
        try {
            if (typeof document !== "undefined" && document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch {
            // Navigation still closes StoryTeller when the browser rejects exitFullscreen.
        } finally {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        if (slideCount < 1 || typeof window === "undefined") return undefined;

        const onKeyDown = (event) => {
            if (event.defaultPrevented || event.key !== "Escape") return;
            event.preventDefault();
            void close();
        };

        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [close, slideCount]);

    return {
        rootRef,
        activeStory,
        activeIndex,
        nextStory,
        nextIndex,
        slideNumber,
        slideCount,
        direction,
        canGoPrevious,
        canGoNext,
        shouldPreloadNext,
        canFullscreen,
        isFullscreen,
        close,
        goPrevious,
        goNext,
        handleActiveImageLoad,
        toggleFullscreen,
    };
};

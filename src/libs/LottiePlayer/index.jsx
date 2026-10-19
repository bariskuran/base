import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../Icon";
import stopIcon from "../Icon/icons/stop";
import { PlayerContainer, PlayerControls, PlayerStage } from "./_styled";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeSources = (src) => {
    if (src == null) return [];
    return (Array.isArray(src) ? src : [src]).filter(Boolean);
};

const getSourceOptions = (src) => {
    if (typeof src === "string") return { path: src };
    if (src && typeof src === "object") return { animationData: src };
    return null;
};

const getScrollOffset = (axis) => {
    if (typeof window === "undefined") return 0;
    return axis === "x"
        ? window.scrollX || document.documentElement.scrollLeft || 0
        : window.scrollY || document.documentElement.scrollTop || 0;
};

const getViewportSize = (axis) => {
    if (typeof window === "undefined") return 0;
    return axis === "x" ? window.innerWidth : window.innerHeight;
};

const getTrackDocumentStart = (element, axis) => {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    return (axis === "x" ? rect.left : rect.top) + getScrollOffset(axis);
};

const getFrameRange = (instance, startAt, stopAt) => {
    const first = instance.firstFrame || 0;
    const last = Math.max(first, first + instance.totalFrames - 1);
    return {
        start: clamp(Number.isFinite(Number(startAt)) ? Number(startAt) : first, first, last),
        stop: clamp(Number.isFinite(Number(stopAt)) ? Number(stopAt) : last, first, last),
    };
};

const setInstancesFrame = (instances, progress, startAt, stopAt) => {
    instances.forEach((instance) => {
        const range = getFrameRange(instance, startAt, stopAt);
        const frame = range.start + (range.stop - range.start) * clamp(progress, 0, 1);
        instance.goToAndStop(frame, true);
    });
};

/**
 * Renders Lottie JSON with lottie-web and adds Base playback modes around it.
 * `src` may be a JSON URL, imported animation data, or an ordered array of either.
 */
export const LottiePlayer = ({
    name = "lottiePlayer",
    mode = "byDeveloper",
    src,
    w,
    h = "auto",
    width,
    height,
    size = "100%",
    fit = "contain",
    align = "center",
    autoplay = false,
    hover = false,
    loop = false,
    speed = 1,
    direction = 1,
    isWorking = true,
    isPaused = true,
    manualPerc,
    viewportRange = [25, 75],
    scrollDirection = "y",
    startAt,
    stopAt,
    scrollLength = 1,
    controls = true,
    className,
    style,
    onReady,
    onComplete,
    onError,
    ...rest
}) => {
    const sources = useMemo(() => normalizeSources(src), [src]);
    const containersRef = useRef([]);
    const instancesRef = useRef([]);
    const trackRef = useRef(null);
    const hoverRef = useRef(false);
    const wasInViewportRef = useRef(false);
    const loadedSourcesRef = useRef(null);
    const loadCounterRef = useRef(0);
    const callbacksRef = useRef({});
    const settingsRef = useRef({});
    const playDirectionRef = useRef(Number(direction) < 0 ? -1 : 1);
    callbacksRef.current = { onReady, onComplete, onError };
    settingsRef.current = { speed, direction, loop };
    const [loadedCount, setLoadedCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isStopped, setIsStopped] = useState(true);
    const [viewport, setViewport] = useState({ width: 0, height: 0 });
    const isReady = sources.length > 0 && loadedCount >= sources.length && loadedSourcesRef.current === sources;
    const axis = scrollDirection === "x" || scrollDirection === "left" ? "x" : "y";
    const resolvedWidth = width ?? w ?? size;
    const resolvedHeight = height ?? h;
    const normalizedViewportRange = Array.isArray(viewportRange) ? viewportRange : [25, 75];
    const viewportStart = clamp(Number(normalizedViewportRange[0]) || 0, 0, 100);
    const viewportEnd = clamp(Number(normalizedViewportRange[1]) || 100, viewportStart, 100);
    const stickyDistance = Math.max(0.1, Number(scrollLength) || 1);
    const viewportScrollLength = (axis === "x" ? viewport.width : viewport.height) * stickyDistance;

    const callInstances = useCallback((method, ...args) => {
        instancesRef.current.forEach((instance) => instance?.[method]?.(...args));
    }, []);

    const seekProgress = useCallback(
        (progress) => setInstancesFrame(instancesRef.current, progress, startAt, stopAt),
        [startAt, stopAt],
    );

    const setPlaying = useCallback((nextPlaying) => {
        setIsPlaying(nextPlaying);
        callInstances(nextPlaying ? "play" : "pause");
    }, [callInstances]);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;
        const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        updateViewport();
        window.addEventListener("resize", updateViewport);
        return () => window.removeEventListener("resize", updateViewport);
    }, []);

    useEffect(() => {
        let isCancelled = false;
        const instances = [];
        setLoadedCount(0);
        loadedSourcesRef.current = null;
        loadCounterRef.current = 0;
        instancesRef.current = [];

        if (!sources.length) return undefined;

        import("lottie-web")
            .then((module) => {
                if (isCancelled) return;
                const lottie = module.default || module;
                sources.forEach((source, index) => {
                    const sourceOptions = getSourceOptions(source);
                    const container = containersRef.current[index];
                    if (!sourceOptions || !container) return;

                    const instance = lottie.loadAnimation({
                        ...sourceOptions,
                        container,
                        renderer: "svg",
                        loop: false,
                        autoplay: false,
                        rendererSettings: {
                            preserveAspectRatio: `${
                                align === "top" ? "xMidYMin" :
                                    align === "bottom" ? "xMidYMax" :
                                        align === "left" ? "xMinYMid" :
                                            align === "right" ? "xMaxYMid" : "xMidYMid"
                            } ${fit === "cover" ? "slice" : "meet"}`,
                        },
                    });
                    instances[index] = instance;
                    instancesRef.current[index] = instance;

                    instance.addEventListener("DOMLoaded", () => {
                        if (isCancelled) return;
                        instance.setSpeed(Number(settingsRef.current.speed) || 1);
                        instance.setDirection(Number(settingsRef.current.direction) < 0 ? -1 : 1);
                        instance.goToAndStop(instance.firstFrame || 0, true);
                        loadCounterRef.current += 1;
                        if (loadCounterRef.current >= sources.length) loadedSourcesRef.current = sources;
                        setLoadedCount(loadCounterRef.current);
                    });
                    instance.addEventListener("complete", () => {
                        if (settingsRef.current.loop === "boomerang" && instance === instancesRef.current[0]) {
                            playDirectionRef.current *= -1;
                            callInstances("setDirection", playDirectionRef.current);
                            callInstances("play");
                            setIsPlaying(true);
                            setIsStopped(false);
                            callbacksRef.current.onComplete?.(instance);
                            return;
                        }
                        setIsPlaying(false);
                        setIsStopped(true);
                        callbacksRef.current.onComplete?.(instance);
                    });
                    instance.addEventListener("data_failed", (error) => callbacksRef.current.onError?.(error, source));
                });
            })
            .catch((error) => callbacksRef.current.onError?.(error, src));

        return () => {
            isCancelled = true;
            instances.forEach((instance) => instance?.destroy());
            instancesRef.current = [];
        };
    }, [sources, src, align, fit]);

    useEffect(() => {
        if (!isReady) return;
        callbacksRef.current.onReady?.(instancesRef.current);
    }, [isReady]);

    useEffect(() => {
        if (!isReady) return;

        if (mode === "byDeveloper") {
            if (!isWorking) {
                setPlaying(false);
                return;
            }
            if (manualPerc !== undefined && manualPerc !== null) {
                setPlaying(false);
                seekProgress(clamp(Number(manualPerc) / 100, 0, 1));
                return;
            }
            if (isPaused) {
                setPlaying(false);
                return;
            }
            callInstances("setLoop", loop === "boomerang" ? false : loop);
            callInstances("setSpeed", Number(speed) || 1);
            playDirectionRef.current = Number(direction) < 0 ? -1 : 1;
            callInstances("setDirection", playDirectionRef.current);
            setPlaying(true);
            return;
        }

        if (mode === "byUser") {
            callInstances("setLoop", loop === "boomerang" ? false : loop);
            callInstances("setSpeed", Number(speed) || 1);
            return;
        }

        if (mode === "byScroll") {
            setPlaying(false);
            return;
        }

        if (mode === "byViewport") {
            callInstances("setLoop", loop === "boomerang" ? false : loop);
            callInstances("setSpeed", Number(speed) || 1);
            setPlaying(false);
            return;
        }

        setPlaying(false);
    }, [
        isReady, mode, isWorking, isPaused, manualPerc, loop, speed, direction,
        callInstances, seekProgress, setPlaying,
    ]);

    useEffect(() => {
        if (!isReady || mode !== "byUser") return;
        if (autoplay) setIsStopped(false);
        setPlaying(autoplay);
    }, [isReady, mode, autoplay, setPlaying]);

    useEffect(() => {
        if (!isReady || mode !== "byViewport") return undefined;
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const element = trackRef.current;
                if (!element) return;
                const rect = element.getBoundingClientRect();
                const viewportSize = getViewportSize(axis);
                const top = axis === "x" ? rect.left : rect.top;
                const bottom = axis === "x" ? rect.right : rect.bottom;
                const bandStart = (viewportSize * viewportStart) / 100;
                const bandEnd = (viewportSize * viewportEnd) / 100;
                const isInsideBand = bottom > bandStart && top < bandEnd;

                if (isInsideBand && !wasInViewportRef.current) {
                    const first = instancesRef.current[0];
                    if (first && first.currentFrame >= first.totalFrames - 1) callInstances("goToAndStop", 0, true);
                    setPlaying(true);
                } else if (!isInsideBand && wasInViewportRef.current) {
                    setPlaying(false);
                }
                wasInViewportRef.current = isInsideBand;
            });
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            wasInViewportRef.current = false;
        };
    }, [isReady, mode, axis, viewportStart, viewportEnd, callInstances, setPlaying]);

    useEffect(() => {
        if (!isReady || mode !== "byScroll") return undefined;
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const trackStart = getTrackDocumentStart(trackRef.current, axis);
                const scrollPosition = getScrollOffset(axis);
                const viewportSize = getViewportSize(axis);
                const distance = viewportScrollLength || viewportSize * stickyDistance;
                const progress = distance > 0 ? (scrollPosition - trackStart) / distance : 0;
                seekProgress(clamp(progress, 0, 1));
            });
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [isReady, mode, axis, viewportScrollLength, stickyDistance, seekProgress]);

    useEffect(() => {
        if (!isReady || mode === "byScroll" || mode === "byViewport") return;
        callInstances("setSpeed", (Number(speed) || 1) * (hoverRef.current && hover ? 2 : 1));
        callInstances("setDirection", hoverRef.current && hover ? 1 : Number(direction) < 0 ? -1 : 1);
    }, [isReady, mode, speed, direction, hover, callInstances]);

    const handlePlay = () => {
        if (isStopped) {
            instancesRef.current.forEach((instance) => {
                instance?.goToAndStop(instance.firstFrame || 0, true);
            });
        }
        playDirectionRef.current = Number(direction) < 0 ? -1 : 1;
        callInstances("setDirection", playDirectionRef.current);
        callInstances("setSpeed", Number(speed) || 1);
        setIsStopped(false);
        setPlaying(true);
    };
    const handlePause = () => {
        setIsStopped(false);
        setPlaying(false);
    };
    const handleStop = () => {
        setPlaying(false);
        setIsStopped(true);
        instancesRef.current.forEach((instance) => {
            instance?.stop();
            instance?.goToAndStop(instance.firstFrame || 0, true);
        });
    };
    const handleMouseEnter = () => {
        hoverRef.current = true;
        if (!hover || mode === "byScroll" || mode === "byViewport") return;
        playDirectionRef.current = Number(direction) < 0 ? -1 : 1;
        callInstances("setDirection", playDirectionRef.current);
        callInstances("setSpeed", Number(speed) || 1);
        setPlaying(true);
    };
    const handleMouseLeave = () => {
        hoverRef.current = false;
        if (!hover || mode === "byScroll" || mode === "byViewport") return;
        if (loop === true || (typeof loop === "number" && loop > 0) || loop === "boomerang") {
            setPlaying(false);
            return;
        }
        playDirectionRef.current = Number(direction) < 0 ? 1 : -1;
        callInstances("setDirection", playDirectionRef.current);
        callInstances("setSpeed", (Number(speed) || 1) * 2);
        setPlaying(true);
    };

    const isByScroll = mode === "byScroll";
    const playerStyle = {
        width: resolvedWidth,
        height: resolvedHeight === "auto" ? undefined : resolvedHeight,
        aspectRatio: resolvedHeight === "auto" && isReady && instancesRef.current[0]?.animationData
            ? `${instancesRef.current[0].animationData.w} / ${instancesRef.current[0].animationData.h}`
            : undefined,
        ...style,
    };
    const trackStyle = isByScroll
        ? axis === "x"
            ? {
                  width: viewport.width
                      ? viewport.width + viewportScrollLength
                      : `calc(100vw + ${stickyDistance * 100}vw)`,
                  height: "100%",
              }
            : {
                  height: viewport.height
                      ? viewport.height + viewportScrollLength
                      : `calc(100vh + ${stickyDistance * 100}vh)`,
                  width: "100%",
              }
        : undefined;
    const stageStyle = isByScroll
        ? axis === "x"
            ? { position: "sticky", left: 0, width: viewport.width || "100vw", height: "100vh" }
            : { position: "sticky", top: 0, width: "100%", height: viewport.height || "100vh" }
        : undefined;

    return (
        <PlayerContainer
            ref={trackRef}
            aria-label={name}
            className={className}
            data-mode={mode}
            data-axis={axis}
            style={trackStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...rest}
        >
            <PlayerStage data-sticky={isByScroll ? "true" : "false"} style={stageStyle}>
                <div className="base-lottie-player__animation" style={playerStyle}>
                    {sources.map((source, index) => (
                        <div
                            key={index}
                            className="base-lottie-player__layer"
                            ref={(element) => { containersRef.current[index] = element; }}
                            style={{ zIndex: index }}
                            aria-hidden="true"
                            data-source-index={index}
                        />
                    ))}
                </div>
                {mode === "byUser" && controls && (
                    <PlayerControls aria-label={`${name} controls`}>
                        <button type="button" onClick={isPlaying ? handlePause : handlePlay} aria-label={isPlaying ? "Pause animation" : "Play animation"}>
                            <Icon icon={isPlaying ? "pause" : "play"} width={9} flat disableScaleEffect disablePulseEffect />
                        </button>
                        <button type="button" onClick={handleStop} disabled={isStopped} aria-label="Stop animation">
                            <Icon icon={stopIcon} width={9} flat disableScaleEffect disablePulseEffect />
                        </button>
                    </PlayerControls>
                )}
            </PlayerStage>
        </PlayerContainer>
    );
};

LottiePlayer.displayName = "LottiePlayer";

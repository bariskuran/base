import { useCallback, useEffect, useMemo, useRef } from "react";
import { baseStore } from "../baseStore";
import { useObserver } from "../useObserver";
import { useTimer } from "../useTimer";
import {
    formatCountNumber,
    lerpCountValue,
    resolveEndList,
    resolveStartList,
    toFiniteNumber,
} from "./format";

const STATUS = {
    idle: "idle",
    running: "running",
    paused: "paused",
    completed: "completed",
};

const durationToMs = (duration) => {
    const seconds = toFiniteNumber(duration, 3);
    return Math.max(16, seconds * 1000);
};

const cloneValues = (value) => (Array.isArray(value) ? value.slice() : value);

const valuesEqual = (left, right) => {
    if (Object.is(left, right)) return true;
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
        if (!Object.is(left[index], right[index])) return false;
    }
    return true;
};

export const useVars = ({
    startNumber,
    endNumber,
    duration = 3,
    startOnViewport = true,
    restartOnView = true,
    step,
    decimal = 0,
    enableLocale = true,
} = {}) => {
    const isMulti = Array.isArray(endNumber);
    const resolvedEnds = isMulti ? resolveEndList(endNumber) : null;
    const hasEnd = isMulti
        ? resolvedEnds != null && resolvedEnds.length > 0
        : endNumber != null && endNumber !== "" && Number.isFinite(Number(endNumber));

    const resolvedStarts = isMulti
        ? resolveStartList(startNumber, resolvedEnds?.length || 0)
        : null;
    const resolvedStart = isMulti
        ? 0
        : startNumber != null && startNumber !== ""
          ? toFiniteNumber(startNumber, 0)
          : 0;

    const resolvedEnd = hasEnd && !isMulti ? toFiniteNumber(endNumber, 0) : null;

    const resolvedStep =
        step != null && step !== "" && Number.isFinite(Number(step)) ? Number(step) : hasEnd ? null : 1;
    const resolvedDecimal = Math.max(0, Math.floor(toFiniteNumber(decimal, 0)));
    const tickMs = durationToMs(duration);
    const needsObserver = startOnViewport || (hasEnd && restartOnView);

    const language = baseStore.useGlobal((s) => s.language) || "en";

    const initialRaw = isMulti ? resolvedStarts : resolvedStart;
    const startsKey = isMulti ? (resolvedStarts || []).join("|") : String(resolvedStart);
    const endsKey = isMulti ? (resolvedEnds || []).join("|") : String(resolvedEnd);

    const { rawValue, status, set } = baseStore.useLocal({
        rawValue: initialRaw,
        status: STATUS.idle,
    });

    const setRef = useRef(set);
    setRef.current = set;

    const rawValueRef = useRef(rawValue);
    rawValueRef.current = rawValue;

    const statusRef = useRef(status);
    statusRef.current = status;

    const configRef = useRef({});
    configRef.current = {
        isMulti,
        hasEnd,
        resolvedStart,
        resolvedStarts,
        resolvedEnd,
        resolvedEnds,
        resolvedStep,
        tickMs,
        durationMs: tickMs,
    };

    const rafRef = useRef(0);
    const animStartedAtRef = useRef(0);
    const animFromRef = useRef(cloneValues(initialRaw));
    const animDurationLeftRef = useRef(tickMs);
    const infinitePausedRef = useRef(false);
    const runFiniteFrameRef = useRef(() => {});

    const { ref, inViewport } = useObserver({
        threshold: 0.15,
        disable: !needsObserver,
    });
    const wasInViewportRef = useRef(false);

    const applyRaw = useCallback((nextRaw, nextStatus) => {
        const statusUnchanged = nextStatus == null || nextStatus === statusRef.current;
        if (statusUnchanged && valuesEqual(rawValueRef.current, nextRaw)) return;

        const patch = { rawValue: nextRaw };
        if (nextStatus != null) patch.status = nextStatus;
        setRef.current?.(patch);
    }, []);

    const clearRaf = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        }
    }, []);

    const runFiniteFrame = useCallback(() => {
        const {
            isMulti: multi,
            resolvedEnd: endScalar,
            resolvedEnds: endList,
            resolvedStart: startScalar,
            resolvedStarts: startList,
            resolvedStep: stepValue,
            durationMs,
        } = configRef.current;

        const elapsed = performance.now() - animStartedAtRef.current;
        const total = Math.max(16, animDurationLeftRef.current || durationMs);
        const progress = Math.min(1, elapsed / total);
        const from = animFromRef.current;

        if (multi) {
            const to = endList || [];
            const starts = startList || [];
            const next = to.map((target, index) =>
                lerpCountValue({
                    from: Number(from?.[index]) || 0,
                    to: target,
                    progress,
                    start: starts[index] ?? 0,
                    step: stepValue,
                }),
            );

            if (progress >= 1) {
                clearRaf();
                applyRaw(to.slice(), STATUS.completed);
                return;
            }

            applyRaw(next, STATUS.running);
            rafRef.current = requestAnimationFrame(() => runFiniteFrameRef.current());
            return;
        }

        const next = lerpCountValue({
            from: Number(from) || 0,
            to: endScalar,
            progress,
            start: startScalar,
            step: stepValue,
        });

        if (progress >= 1) {
            clearRaf();
            applyRaw(endScalar, STATUS.completed);
            return;
        }

        applyRaw(next, STATUS.running);
        rafRef.current = requestAnimationFrame(() => runFiniteFrameRef.current());
    }, [applyRaw, clearRaf]);

    runFiniteFrameRef.current = runFiniteFrame;

    const stopInfiniteTimerRef = useRef(() => {});
    const startInfiniteTimerRef = useRef(() => {});

    const infiniteTimer = useTimer({
        refreshTime: tickMs,
        loop: true,
        startOnLoad: false,
        onEnd: () => {
            if (infinitePausedRef.current) return;
            if (configRef.current.isMulti) return;
            const delta = configRef.current.resolvedStep == null ? 1 : configRef.current.resolvedStep;
            applyRaw(Number(rawValueRef.current) + delta, STATUS.running);
        },
    });

    stopInfiniteTimerRef.current = infiniteTimer.stop;
    startInfiniteTimerRef.current = infiniteTimer.start;

    const pause = useCallback(() => {
        const { hasEnd: finite } = configRef.current;
        if (statusRef.current !== STATUS.running) return;

        if (finite) {
            clearRaf();
            const elapsed = performance.now() - animStartedAtRef.current;
            animDurationLeftRef.current = Math.max(0, animDurationLeftRef.current - elapsed);
            animFromRef.current = cloneValues(rawValueRef.current);
            applyRaw(cloneValues(rawValueRef.current), STATUS.paused);
            return;
        }

        infinitePausedRef.current = true;
        stopInfiniteTimerRef.current?.();
        applyRaw(rawValueRef.current, STATUS.paused);
    }, [applyRaw, clearRaf]);

    const stop = useCallback(() => {
        const { resolvedStart: startValue, resolvedStarts: startList, isMulti: multi } =
            configRef.current;
        clearRaf();
        infinitePausedRef.current = false;
        stopInfiniteTimerRef.current?.();
        animDurationLeftRef.current = configRef.current.durationMs;
        const resetValue = multi ? (startList || []).slice() : startValue;
        animFromRef.current = cloneValues(resetValue);
        applyRaw(resetValue, STATUS.idle);
    }, [applyRaw, clearRaf]);

    const start = useCallback(() => {
        const {
            hasEnd: finite,
            isMulti: multi,
            resolvedEnd: endScalar,
            resolvedEnds: endList,
            resolvedStart: startValue,
            resolvedStarts: startList,
            durationMs,
        } = configRef.current;

        if (finite) {
            if (statusRef.current === STATUS.running) return;
            if (multi ? !endList?.length : endScalar == null) return;

            const startValues = multi ? (startList || []).slice() : startValue;

            if (statusRef.current === STATUS.completed || statusRef.current === STATUS.idle) {
                animFromRef.current = cloneValues(startValues);
                animDurationLeftRef.current = durationMs;
                applyRaw(cloneValues(startValues), STATUS.running);
            } else if (statusRef.current === STATUS.paused) {
                animFromRef.current = cloneValues(rawValueRef.current);
                applyRaw(cloneValues(rawValueRef.current), STATUS.running);
            }

            clearRaf();
            animStartedAtRef.current = performance.now();
            if (!(animDurationLeftRef.current > 0)) {
                animDurationLeftRef.current = durationMs;
            }
            rafRef.current = requestAnimationFrame(runFiniteFrame);
            return;
        }

        if (startNumber == null) {
            console.warn("useCountNumber: startNumber is required when endNumber is omitted.");
        }

        infinitePausedRef.current = false;
        if (statusRef.current === STATUS.idle) {
            applyRaw(startValue, STATUS.running);
        } else {
            applyRaw(rawValueRef.current, STATUS.running);
        }
        startInfiniteTimerRef.current?.({ refreshTime: configRef.current.tickMs, loop: true });
    }, [applyRaw, clearRaf, runFiniteFrame, startNumber]);

    // Sync start/end targets when props change while idle (keyed — avoid array identity loops).
    useEffect(() => {
        if (statusRef.current !== STATUS.idle) return;
        const { isMulti: multi, resolvedStarts: starts, resolvedStart: start } = configRef.current;
        const next = multi ? (starts || []).slice() : start;
        applyRaw(next, STATUS.idle);
        animFromRef.current = cloneValues(next);
        animDurationLeftRef.current = tickMs;
    }, [startsKey, endsKey, tickMs, applyRaw]);

    useEffect(() => {
        if (!hasEnd && !isMulti && status === STATUS.running) {
            stopInfiniteTimerRef.current?.();
            startInfiniteTimerRef.current?.({ refreshTime: tickMs, loop: true });
        }
    }, [tickMs, hasEnd, isMulti, status]);

    useEffect(() => {
        if (!startOnViewport) return;
        if (!inViewport) return;
        if (statusRef.current !== STATUS.idle) return;
        start();
    }, [startOnViewport, inViewport, start]);

    useEffect(() => {
        const wasIn = wasInViewportRef.current;
        wasInViewportRef.current = inViewport;

        if (!hasEnd || !restartOnView) return;
        if (!wasIn || inViewport) return;
        stop();
    }, [hasEnd, restartOnView, inViewport, stop]);

    useEffect(
        () => () => {
            clearRaf();
            stopInfiniteTimerRef.current?.();
        },
        [clearRaf],
    );

    const formatOptions = useMemo(
        () => ({
            decimal: resolvedDecimal,
            enableLocale: enableLocale !== false,
            language,
        }),
        [resolvedDecimal, enableLocale, language],
    );

    const currentNumber = useMemo(() => {
        if (Array.isArray(rawValue)) {
            return rawValue.map((value) => formatCountNumber(value, formatOptions));
        }
        return formatCountNumber(rawValue, formatOptions);
    }, [rawValue, formatOptions]);

    return {
        currentNumber,
        ref,
        start,
        pause,
        stop,
        isRunning: status === STATUS.running,
        isPaused: status === STATUS.paused,
        isCompleted: status === STATUS.completed,
        status,
        inViewport,
        hasEnd,
        isMulti,
        rawValue,
    };
};

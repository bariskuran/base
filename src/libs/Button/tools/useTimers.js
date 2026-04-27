import { useTimer } from "../../useTimer";
import { useMemo } from "react";

const normalizeTimerMs = (value, fallback) => {
    if (value == null || value === "") return fallback;
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, n);
};

export const useTimers = (p) => {
    const {
        label,
        prefix,
        suffix,
        icon,
        delay,
        setLocal,
        onDelayStart,
        onDelayEnd,
        runAction,
        getTimerBaseName,
        clickCooldownMs,
        showOnClickHoldMs,
    } = p || {};

    const cooldownMs = normalizeTimerMs(clickCooldownMs, 1000);
    const showOnClickHoldDurationMs = normalizeTimerMs(showOnClickHoldMs, 2000);

    const timerBaseName = useMemo(
        () => getTimerBaseName({ label, prefix, suffix, icon }),
        [label, prefix, suffix, icon],
    );

    const {
        start: showOnClickValuesStart,
        stop: showOnClickValuesStop,
        isRunning: isShowOnClickValuesRunning,
    } = useTimer({
        timerName: `showOnClickValues-${timerBaseName}`,
        refreshTime: showOnClickHoldDurationMs,
        loop: false,
        onStart: () =>
            setLocal?.((s) => {
                s.showOnClickValues = true;
            }),
        onEnd: () =>
            setLocal?.((s) => {
                s.showOnClickValues = false;
            }),
        startOnLoad: false,
    });

    const { start: clickBlockerStart, isRunning: isClickBlockerRunning } = useTimer({
        timerName: `clickBlocker-${timerBaseName}`,
        refreshTime: cooldownMs,
        loop: false,
        onStart: () =>
            setLocal?.((s) => {
                s.clickBlocker = true;
            }),
        onEnd: () =>
            setLocal?.((s) => {
                s.clickBlocker = false;
            }),
        startOnLoad: false,
    });

    const { start: delayStart, isRunning: isDelayRunning } = useTimer({
        timerName: `delay-${timerBaseName}`,
        refreshTime: Math.max(0, Number(delay || 0)) * 1000,
        loop: false,
        onStart: () => {
            onDelayStart?.();
        },
        onEnd: () => {
            onDelayEnd?.();
            runAction?.();
        },
        startOnLoad: false,
    });

    return {
        showOnClickValuesStart,
        showOnClickValuesStop,
        isShowOnClickValuesRunning,
        clickBlockerStart,
        isClickBlockerRunning,
        delayStart,
        isDelayRunning,
    };
};

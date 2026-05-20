import { useTimer } from "../../useTimer";
import { useId, useMemo } from "react";

const normalizeTimerMs = (value, fallback) => {
    if (value == null || value === "") return fallback;
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, n);
};

export const useTimers = (p) => {
    const {
        delay,
        setLocal,
        onDelayStart,
        onDelayEnd,
        runAction,
        clickCooldownMs,
        onClickHoldMs,
    } = p || {};

    const cooldownMs = normalizeTimerMs(clickCooldownMs, 1000);
    const showOnClickHoldDurationMs = normalizeTimerMs(onClickHoldMs, 2000);

    // Label değişince timer adı değişmemeli; aksi halde stop cleanup onEnd çağırmadan clickBlocker'da kalır
    const instanceId = useId();
    const timerBaseName = useMemo(() => instanceId.replace(/:/g, "_"), [instanceId]);

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

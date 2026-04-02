import { useTimer } from "../../useTimer";
import { useMemo } from "react";

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
    } = p || {};

    const timerBaseName = useMemo(
        () => getTimerBaseName({ label, prefix, suffix, icon }),
        [label, prefix, suffix, icon],
    );

    const { start: showOnClickValuesStart, isRunning: isShowOnClickValuesRunning } = useTimer({
        timerName: `showOnClickValues-${timerBaseName}`,
        refreshTime: 2000,
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
        refreshTime: 1000,
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
        isShowOnClickValuesRunning,
        clickBlockerStart,
        isClickBlockerRunning,
        delayStart,
        isDelayRunning,
    };
};

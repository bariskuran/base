import { useRef, useEffect, useCallback } from "react";
import { baseStore } from "../@baseStore";
/*

const {start, stop, isRunning} = useTimer({
  refreshTime: 2000,
  loop: false,
  onStart: () => console.log("started"),
  onEnd: () => console.log("ended"),
  startOnLoad: false, // doesn't need to be triggered manually.
});
start(); // starts the timer if startOnLoad is false.

*/

/**
 * React hook that provides a controllable timeout with optional looping behavior.
 *
 * @typedef {Object} useTimerSettings
 * @property {() => void} [onStart] - Callback executed immediately when the timeout starts
 * @property {() => void} [onEnd] - Callback executed when the timeout completes
 * @property {number} [refreshTime=1000] - Delay in milliseconds before the timeout completes
 * @property {boolean} [loop=true] - Whether the timeout should automatically restart after completion
 * @property {boolean} [startOnLoad=false] - Whether the timeout should start automatically on mount
 *
 * @param {useTimerSettings} [settings={}] - Configuration options for the timeout
 *
 * @returns {[
 *   (overrides?: Partial<Pick<useTimerSettings, "refreshTime" | "loop">>) => void,
 *   () => void,
 *   boolean
 * ]}
 * Returns `[startTimeout, stopTimeout, isRunning]`
 */
export const useTimer = (settings = {}) => {
    const { onStart, onEnd, refreshTime = 1000, loop = true, startOnLoad = false } = settings;
    const { isRunning, setLocal } = baseStore.useLocal({ isRunning: false });

    const timeoutRef = useRef(null);
    const onStartRef = useRef(onStart);
    const onEndRef = useRef(onEnd);
    const refreshRef = useRef(refreshTime);
    const loopRef = useRef(loop);
    const startRef = useRef(() => {});

    useEffect(() => {
        onStartRef.current = onStart;
    }, [onStart]);

    useEffect(() => {
        onEndRef.current = onEnd;
    }, [onEnd]);

    useEffect(() => {
        refreshRef.current = refreshTime;
    }, [refreshTime]);

    useEffect(() => {
        loopRef.current = loop;
    }, [loop]);

    const stopTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setLocal?.({ isRunning: false });
    }, []);

    const startTimeout = useCallback(
        (overrides = {}) => {
            const { refreshTime: refreshOverride, loop: loopOverride } = overrides;

            if (typeof refreshOverride === "number") {
                refreshRef.current = refreshOverride;
            }
            if (typeof loopOverride === "boolean") {
                loopRef.current = loopOverride;
            }

            stopTimeout();
            if (!onEndRef.current) return;

            setLocal?.({ isRunning: true });
            onStartRef.current?.();

            timeoutRef.current = setTimeout(() => {
                onEndRef.current?.();

                if (loopRef.current) {
                    startRef.current?.();
                } else {
                    setLocal?.({ isRunning: false });
                }
            }, refreshRef.current);
        },
        [stopTimeout],
    );

    useEffect(() => {
        startRef.current = startTimeout;
    }, [startTimeout]);

    useEffect(() => {
        if (startOnLoad) startTimeout();
        return () => stopTimeout();
    }, [startOnLoad, startTimeout, stopTimeout]);

    return { start: startTimeout, stop: stopTimeout, isRunning };
};

import { useEffect, useRef } from "react";
import { useBase } from "../useBase";
import { useEventListener } from "../useEventListener";
import { baseStore } from "../baseStore";
import { useEffectAfterMount } from "../useEffectAfterMount";

export const IdleManagerListener = () => {
    const [
        BASE_SETTINGS,
        set,
        addToLoading,
        removeFromLoading,
        isIdle,
        date,
        refreshManuallyTriggerer,
    ] = useBase((s) => [
        s.BASE_SETTINGS,
        s.set,
        s.addToLoading,
        s.removeFromLoading,
        s.isIdle,
        s.date,
        s.refreshManuallyTriggerer,
    ]);
    const { idleManager = {} } = BASE_SETTINGS || {};

    const {
        // disableIdleManager = false,
        allowance = 60,
        onIdleFunction,
        refreshTime = 60,
        onRefreshFunction,
        onIdleBreakFunction,
        showLoadingScreenOnIdle = false,
    } = idleManager;
    const timeoutForHourlyRefresh = useRef(null);
    const timeoutForIdleStart = useRef(null);
    const timeoutForIdle = useRef(null);

    /**
     * Refresh Function
     */
    const setTimeoutForRefresh = () => {
        const nextDate = date.now
            .calculateNewDate({ ts: refreshTime * 60 * 1000 })
            .format("YYYY.MM.DD HH:NN");
        set({ nextRefreshTime: nextDate });
        timeoutForHourlyRefresh.current = setTimeout(onRefresh, 1000 * 60 * refreshTime);
    };
    const onRefresh = (isManually = false) => {
        const currentTime = date.now.format("YYYY/MM/DD HH:NN");
        console.log(
            isManually
                ? "idleManager's onRefresh is called manually."
                : "idleManager's onRefresh is called automatically.",
            currentTime,
        );
        setTimeoutForRefresh();
        onRefreshFunction && onRefreshFunction(baseStore);
    };
    useEffectAfterMount(() => {
        if (refreshManuallyTriggerer === 0) return;
        onRefresh(true);
    }, [refreshManuallyTriggerer]);

    useEffect(() => {
        setTimeoutForRefresh();
        detectMouseStop();
        return () => {
            clearTimeout(timeoutForHourlyRefresh.current);
            clearTimeout(timeoutForIdle.current);
            clearTimeout(timeoutForIdleStart.current);
            removeFromLoading("User is off");
        };
    }, []);

    /**
     * Idle Manager
     */

    const detectMouseStop = () => {
        clearTimeout(timeoutForIdleStart.current);
        timeoutForIdleStart.current = setTimeout(startIdlePeriod, 5000);
    };
    const startIdlePeriod = () => {
        clearTimeout(timeoutForIdle.current);
        timeoutForIdle.current = setTimeout(onIdle, allowance * 1000 * 60 - 5000);
    };
    const onIdle = () => {
        if (showLoadingScreenOnIdle) addToLoading("User is off");
        set({ isIdle: true });
        onIdleFunction && onIdleFunction(baseStore);
    };
    const onIdleBreak = () => {
        clearTimeout(timeoutForIdleStart.current);
        clearTimeout(timeoutForIdle.current);
        detectMouseStop();
        if (!isIdle) return;
        if (showLoadingScreenOnIdle) removeFromLoading("User is off");
        set({ isIdle: false });
        onIdleBreakFunction && onIdleBreakFunction(baseStore);
    };

    const tabChangeListener = () => {
        if (!document.hidden) onIdleBreak();
    };
    useEventListener("mousemove", onIdleBreak, { delay: 500 });
    useEventListener("visibilitychange", tabChangeListener, { source: document, delay: 500 });

    return null;
};

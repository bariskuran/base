import { useCallback, useEffect, useMemo, useRef } from "react";
import { baseStore } from "../@baseStore";
import { useEventListener } from "../useEventListener";
import { useTimer } from "../useTimer";

const clampMinutes = (v, { allowedIdleTime = 30 } = {}) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return allowedIdleTime;
    return n;
};

export const IdleManager = () => {
    const [_idleManager = {}] = baseStore.useGlobal((s) => [s._idleManager]);

    const enabled = !!_idleManager?.enabled;
    const allowedIdleMinutes = useMemo(
        () => clampMinutes(_idleManager?.allowedIdleTime),
        [_idleManager?.allowedIdleTime],
    );
    const allowedIdleMs = useMemo(() => {
        if (!allowedIdleMinutes) return null;
        return allowedIdleMinutes * 60 * 1000;
    }, [allowedIdleMinutes]);

    const { isIdle, set } = baseStore.useLocal({ isIdle: false });
    const { set: setGlobal } = baseStore.useGlobal();

    useEffect(() => {
        setGlobal?.({ isIdle });
    }, [isIdle, setGlobal]);

    const isIdleRef = useRef(false);
    const lastActiveAtRef = useRef(0);

    const onIdleRef = useRef(null);
    const onActiveRef = useRef(null);

    useEffect(() => {
        onIdleRef.current = typeof _idleManager?.onIdle === "function" ? _idleManager.onIdle : null;
        onActiveRef.current =
            typeof _idleManager?.onActive === "function" ? _idleManager.onActive : null;
    }, [_idleManager?.onIdle, _idleManager?.onActive]);

    const handleGoIdle = useCallback(() => {
        if (!enabled) return;
        if (typeof allowedIdleMs !== "number") return;
        if (isIdleRef.current) return;

        isIdleRef.current = true;
        set?.({ isIdle: true });

        const nowTs = Date.now();
        const idleForMs = nowTs - (lastActiveAtRef.current || nowTs);

        console.log(
            `[baseIdleManager] User has been idle for ~${Math.round(idleForMs / 60000)} minutes. System is now idle.`,
        );

        try {
            onIdleRef.current?.({
                baseStore,
                nowTs,
                idleForMs,
                allowedIdleMinutes,
            });
        } catch (err) {
            console.error("[baseIdleManager] onIdle callback error:", err);
        }
    }, [enabled, allowedIdleMs, set, allowedIdleMinutes]);

    const { start, stop } = useTimer({
        timerName: "idleManager",
        loop: false,
        startOnLoad: false,
        refreshTime: 0,
        onEnd: handleGoIdle,
    });

    const restartTimer = useCallback(() => {
        if (!enabled) return;
        if (typeof allowedIdleMs !== "number") return;

        start?.({ refreshTime: allowedIdleMs, loop: false });
    }, [enabled, allowedIdleMs, start]);

    const handleActivity = useCallback(
        (reason = "activity") => {
            if (!enabled) return;
            if (typeof allowedIdleMs !== "number") return;

            const now = Date.now();
            lastActiveAtRef.current = now;

            if (isIdleRef.current) {
                isIdleRef.current = false;
                set?.({ isIdle: false });

                console.log(`[baseIdleManager] User is active again (${reason}). System resumed.`);

                try {
                    onActiveRef.current?.({ baseStore, nowTs: now, reason });
                } catch (err) {
                    console.error("[baseIdleManager] onActive callback error:", err);
                }
            }

            restartTimer(reason);
        },
        [enabled, allowedIdleMs, restartTimer, set],
    );

    const onVisibilityChange = useCallback(() => {
        if (!enabled) return;
        if (!document.hidden) handleActivity("visibilitychange");
    }, [enabled, handleActivity]);

    const startedOnceRef = useRef(false);

    useEffect(() => {
        if (!enabled) {
            startedOnceRef.current = false;
            stop?.();
            isIdleRef.current = false;
            set?.({ isIdle: false });
            return;
        }

        if (typeof allowedIdleMs !== "number") {
            return;
        }

        lastActiveAtRef.current = Date.now();
        isIdleRef.current = false;
        set?.({ isIdle: false });

        startedOnceRef.current = true;
        restartTimer("init");

        return () => {
            // unmount
            stop?.();
        };
    }, [enabled, allowedIdleMs, allowedIdleMinutes, restartTimer, stop, set]);

    const eventListenerProps = useMemo(
        () => [
            { delay: 500, isThrottle: true, passive: true },
            { delay: 0, passive: true },
            { delay: 0, passive: false },
        ],
        [],
    );

    useEventListener("mousemove", () => handleActivity("mousemove"), eventListenerProps[0]);
    useEventListener("scroll", () => handleActivity("scroll"), eventListenerProps[0]);
    useEventListener("pointerdown", () => handleActivity("pointerdown"), eventListenerProps[1]);
    useEventListener("keydown", () => handleActivity("keydown"), eventListenerProps[2]);
    useEventListener("visibilitychange", onVisibilityChange, {
        ...eventListenerProps[1],
        source: document,
    });

    return null;
};

import { useEffect, useRef } from "react";
import { useEventListener } from "../useEventListener";
import { baseStore } from "../@baseStore";

export const useMouseXY = (delay = 100) => {
    const { x, y, set } = baseStore.useLocal({ x: 0, y: 0 });
    const latestRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef(0);
    const trailingRef = useRef(0);
    const lastEmitRef = useRef(0);

    useEventListener(
        "mousemove",
        ({ clientX, clientY }) => {
            latestRef.current.x = clientX;
            latestRef.current.y = clientY;

            const commit = () => {
                rafRef.current = 0;
                if (trailingRef.current) {
                    clearTimeout(trailingRef.current);
                    trailingRef.current = 0;
                }
                lastEmitRef.current = performance.now();
                const { x: nx, y: ny } = latestRef.current;
                set?.({ x: nx, y: ny });
            };

            const scheduleTrailing = (waitMs) => {
                if (trailingRef.current) return;
                trailingRef.current = setTimeout(commit, waitMs);
            };

            const now = performance.now();
            const elapsed = now - lastEmitRef.current;
            const canCommitNow = delay <= 0 || elapsed >= delay;

            if (canCommitNow) {
                if (rafRef.current) return;
                rafRef.current = requestAnimationFrame(commit);
                return;
            }

            scheduleTrailing(delay - elapsed);
        },
        { delay: 0, passive: true },
    );

    useEffect(
        () => () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (trailingRef.current) clearTimeout(trailingRef.current);
        },
        [],
    );

    return [x, y];
};

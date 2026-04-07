import { useLayoutEffect, useRef } from "react";

const getOverflowParents = (el) => {
    const parents = [];
    if (!el) return parents;

    let current = el.parentElement;

    while (current) {
        const style = getComputedStyle(current);
        const isScrollable =
            /(auto|scroll|overlay)/.test(style.overflow) ||
            /(auto|scroll|overlay)/.test(style.overflowX) ||
            /(auto|scroll|overlay)/.test(style.overflowY);

        if (isScrollable) parents.push(current);
        current = current.parentElement;
    }

    parents.push(window);
    return parents;
};

const simplifyRect = (rect) => ({
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
});

const isSameRect = (a, b) => {
    if (!a || !b) return false;

    return a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height;
};

export const useFloatingAutoUpdate = ({ open, referenceEl, floatingEl, onUpdate }) => {
    const frameRef = useRef(null);
    const loopRef = useRef(null);
    const lastRectRef = useRef(null);
    const lastRunRef = useRef(0);

    useLayoutEffect(() => {
        if (!open || !referenceEl || !floatingEl) return;

        frameRef.current = null;
        loopRef.current = null;
        lastRectRef.current = null;
        lastRunRef.current = 0;

        const THROTTLE_MS = 80;

        const scheduleUpdate = () => {
            const now = performance.now();
            if (now - lastRunRef.current < THROTTLE_MS) return;
            if (frameRef.current) return;
            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null;
                lastRunRef.current = performance.now();
                onUpdate?.();
            });
        };

        const overflowParents = getOverflowParents(referenceEl);

        overflowParents.forEach((parent) => {
            parent.addEventListener("scroll", scheduleUpdate, { passive: true });
        });

        window.addEventListener("resize", scheduleUpdate, { passive: true });

        const ro = new ResizeObserver(() => {
            scheduleUpdate();
        });

        ro.observe(referenceEl);
        ro.observe(floatingEl);

        const checkRectLoop = () => {
            const nextRect = simplifyRect(referenceEl.getBoundingClientRect());

            if (!isSameRect(lastRectRef.current, nextRect)) {
                lastRectRef.current = nextRect;
                scheduleUpdate();
            }

            loopRef.current = requestAnimationFrame(checkRectLoop);
        };

        lastRectRef.current = null;
        scheduleUpdate();
        loopRef.current = requestAnimationFrame(checkRectLoop);

        return () => {
            overflowParents.forEach((parent) => {
                parent.removeEventListener("scroll", scheduleUpdate);
            });

            window.removeEventListener("resize", scheduleUpdate);
            ro.disconnect();

            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }

            if (loopRef.current) {
                cancelAnimationFrame(loopRef.current);
                loopRef.current = null;
            }
        };
    }, [open, referenceEl, floatingEl, onUpdate]);
};

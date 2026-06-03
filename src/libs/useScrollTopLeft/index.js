import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDebouncedFunction } from "../useDebouncedFunction";
import { baseStore } from "../baseStore";
import { attachScrollListener, readScrollLeft, readScrollTop } from "helpers/getScrollParent";
import { useScrollTarget } from "helpers/getScrollParent/useScrollTarget";

export const useScrollTopLeft = (options = {}) => {
    const { source: sourceProp, delay = 0 } = options;

    const { top, left, directionX, directionY, set } = baseStore.useLocal({
        top: 0,
        left: 0,
        directionX: "none",
        directionY: "none",
    });

    const prevRef = useRef({ top: 0, left: 0, inited: false });
    const { ref, source } = useScrollTarget(sourceProp);

    const manualTrigger = useCallback(() => {
        if (!source) return;

        const nextTop = readScrollTop(source);
        const nextLeft = readScrollLeft(source);

        if (!prevRef.current.inited) {
            prevRef.current = { top: nextTop, left: nextLeft, inited: true };
            set?.({ top: nextTop, left: nextLeft, directionX: "none", directionY: "none" });
            return;
        }

        const dy = nextTop - prevRef.current.top;
        const dx = nextLeft - prevRef.current.left;

        if (dy === 0 && dx === 0) {
            return;
        }

        const nextDirectionY = dy === 0 ? "none" : dy > 0 ? "bottom" : "top";
        const nextDirectionX = dx === 0 ? "none" : dx > 0 ? "right" : "left";

        prevRef.current.top = nextTop;
        prevRef.current.left = nextLeft;

        set?.({
            top: nextTop,
            left: nextLeft,
            directionX: nextDirectionX,
            directionY: nextDirectionY,
        });
    }, [source, set]);

    useEffect(() => {
        prevRef.current = { top: 0, left: 0, inited: false };
    }, [source]);

    const throttledTrigger = useDebouncedFunction(manualTrigger, {
        delay,
        isThrottle: true,
    });

    const onScroll = useMemo(
        () => (delay > 0 ? throttledTrigger : manualTrigger),
        [delay, throttledTrigger, manualTrigger],
    );

    useEffect(() => {
        if (!source) return;
        return attachScrollListener(source, onScroll);
    }, [source, onScroll]);

    useEffect(() => {
        manualTrigger();
    }, [manualTrigger]);

    return { scrollTop: top, scrollLeft: left, directionX, directionY, manualTrigger, ref, source };
};

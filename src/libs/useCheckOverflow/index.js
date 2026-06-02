import { baseStore } from "../baseStore";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { useEventListener } from "../useEventListener";

const resolveTarget = (target, ref) => target ?? ref?.current ?? null;

const measureOverflow = (el) => {
    if (!el || typeof document === "undefined") {
        return { isOverflowingY: false, isOverflowingX: false };
    }

    const isWindowLike =
        el === window || el === document.body || el === document.documentElement;

    if (isWindowLike) {
        const docEl = document.documentElement;
        const body = document.body;

        return {
            isOverflowingY:
                Math.max(docEl.scrollHeight, body.scrollHeight) - window.innerHeight > 1,
            isOverflowingX:
                Math.max(docEl.scrollWidth, body.scrollWidth) - window.innerWidth > 1,
        };
    }

    return {
        isOverflowingY: el.scrollHeight - el.clientHeight > 1,
        isOverflowingX: el.scrollWidth - el.clientWidth > 1,
    };
};

export const useCheckOverflow = ({ ref, target }) => {
    const { isOverflowingY, isOverflowingX, resolvedTarget, set } = baseStore.useLocal({
        isOverflowingY: false,
        isOverflowingX: false,
        resolvedTarget: null,
    });

    const checkOverflow = useCallback(() => {
        const el = resolveTarget(target, ref) ?? resolvedTarget;
        if (!el) return;

        const { isOverflowingY: nextY, isOverflowingX: nextX } = measureOverflow(el);

        set((s) => {
            s.isOverflowingY = nextY;
            s.isOverflowingX = nextX;
        });
    }, [target, ref, resolvedTarget, set]);

    useLayoutEffect(() => {
        const nextTarget = resolveTarget(target, ref);

        set((s) => {
            if (s.resolvedTarget !== nextTarget) {
                s.resolvedTarget = nextTarget;
            }
        });
    });

    useEffect(() => {
        const el = resolveTarget(target, ref) ?? resolvedTarget;
        if (!el || typeof document === "undefined") {
            checkOverflow();
            return;
        }

        const isWindowLike =
            el === window || el === document.body || el === document.documentElement;

        if (isWindowLike || typeof ResizeObserver === "undefined") {
            checkOverflow();
            return;
        }

        const ro = new ResizeObserver(() => {
            checkOverflow();
        });

        ro.observe(el);
        checkOverflow();

        return () => {
            ro.disconnect();
        };
    }, [resolvedTarget, target, ref, checkOverflow]);

    useEventListener("resize", checkOverflow, {
        delay: 500,
        isThrottle: true,
        passive: true,
        source: window,
    });

    useEventListener("scroll", checkOverflow, {
        delay: 100,
        isThrottle: true,
        passive: true,
        source:
            typeof document === "undefined"
                ? window
                : (() => {
                      const el = resolveTarget(target, ref) ?? resolvedTarget;
                      if (
                          el == null ||
                          el === window ||
                          el === document.body ||
                          el === document.documentElement
                      ) {
                          return window;
                      }
                      return el;
                  })(),
    });

    return {
        isOverflowingY,
        isOverflowingX,
        isOverflowing: isOverflowingY || isOverflowingX,
    };
};

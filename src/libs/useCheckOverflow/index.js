import { baseStore } from "../@baseStore";
import { useEffect } from "react";

import { useEventListener } from "../useEventListener";

export const useCheckOverflow = ({ ref, target }) => {
    const { isOverflowingY, isOverflowingX, resolvedTarget, setLocal } = baseStore.useLocal({
        isOverflowingY: false,
        isOverflowingX: false,
        resolvedTarget: null,
    });

    const checkOverflow = () => {
        const el = resolvedTarget;
        if (!el || typeof document === "undefined") return;

        let nextOverflowY = false;
        let nextOverflowX = false;

        const isWindowLike =
            el === window || el === document.body || el === document.documentElement;

        if (isWindowLike) {
            const docEl = document.documentElement;
            const body = document.body;

            nextOverflowY =
                Math.max(docEl.scrollHeight, body.scrollHeight) - window.innerHeight > 1;

            nextOverflowX = Math.max(docEl.scrollWidth, body.scrollWidth) - window.innerWidth > 1;
        } else {
            nextOverflowY = el.scrollHeight - el.clientHeight > 1;
            nextOverflowX = el.scrollWidth - el.clientWidth > 1;
        }

        setLocal((s) => {
            s.isOverflowingY = nextOverflowY;
            s.isOverflowingX = nextOverflowX;
        });
    };

    useEffect(() => {
        const nextTarget = target || ref?.current || null;

        setLocal((s) => {
            s.resolvedTarget = nextTarget;
        });
    }, [target, ref, setLocal]);

    useEffect(() => {
        const el = resolvedTarget;
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
    }, [resolvedTarget]);

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
            typeof document === "undefined" ||
            resolvedTarget == null ||
            resolvedTarget === window ||
            resolvedTarget === document.body ||
            resolvedTarget === document.documentElement
                ? window
                : resolvedTarget,
    });

    return {
        isOverflowingY,
        isOverflowingX,
        isOverflowing: isOverflowingY || isOverflowingX,
    };
};

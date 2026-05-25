import { useCallback, useMemo, useRef } from "react";

const SCROLL_EDGE_EPS = 1;

const pickScrollAxis = (data, isRowLayout) => (isRowLayout ? data?.x : data?.y);

const resolveEdgeVisibility = (axis) => {
    const overflowing = !!axis?.isOverflowing;
    const scrollPos = Number(axis?.scrollPos) || 0;
    const maxScroll = Number(axis?.maxScroll) || 0;

    if (!overflowing || maxScroll <= SCROLL_EDGE_EPS) {
        return { start: false, end: false };
    }

    return {
        start: scrollPos > SCROLL_EDGE_EPS,
        end: scrollPos < maxScroll - SCROLL_EDGE_EPS,
    };
};

const applyEdgeOpacityVars = (el, { start, end }) => {
    if (!el?.style) return;

    const startOpacity = start ? "1" : "0";
    const endOpacity = end ? "1" : "0";

    const currentStart = el.style.getPropertyValue("--scroll-edge-start-opacity");
    const currentEnd = el.style.getPropertyValue("--scroll-edge-end-opacity");

    if (currentStart === startOpacity && currentEnd === endOpacity) return;

    el.style.setProperty("--scroll-edge-start-opacity", startOpacity);
    el.style.setProperty("--scroll-edge-end-opacity", endOpacity);
};

export const useScrollEdgeShadow = ({
    enabled = false,
    isRowLayout,
    scrollBarProps = {},
    scrollEdgeWrapRef,
}) => {
    const edgesRef = useRef({ start: false, end: false });

    const onScrollBarExport = useCallback(
        (data) => {
            if (!enabled) return;

            const next = resolveEdgeVisibility(pickScrollAxis(data, isRowLayout));
            const el = scrollEdgeWrapRef?.current;

            if (
                edgesRef.current.start === next.start &&
                edgesRef.current.end === next.end
            ) {
                return;
            }

            edgesRef.current = next;
            applyEdgeOpacityVars(el, next);
        },
        [enabled, isRowLayout, scrollEdgeWrapRef],
    );

    const scrollBarPropsWithEdgeShadow = useMemo(() => {
        if (!enabled) return scrollBarProps;

        const userExport = scrollBarProps.exportData;

        return {
            ...scrollBarProps,
            exportData: (data) => {
                onScrollBarExport(data);
                if (typeof userExport === "function") userExport(data);
            },
        };
    }, [enabled, onScrollBarExport, scrollBarProps]);

    return {
        scrollBarPropsWithEdgeShadow,
    };
};

import { useMemo, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { useExportData } from "../../useExportedData";
import { colorGet } from "../../colorGet";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { baseStore } from "../../@baseStore";
import { getTruncatedHtml } from "./getTruncatedHtml";
import { cssSpacingResolver } from "../../cssSpacingResolver";

const sysDefaults = {
    as: "span",
    weight: 400,
    whiteSpace: "normal",
    overflow: "visible",
    letterSpacing: 0,
    lineHeight: 1.7,
    selfAlign: "left",
};

const useVars = ({ children, content, contentArray, ...p }) => {
    const [theme, currentBreakpoint] = baseStore.useGlobal((s) => [
        s.theme,
        s._clientData.currentBreakpoint,
    ]);

    const { truncatedHtml, setLocal } = baseStore.useLocal({
        truncatedHtml: null,
    });

    const ref = useRef(null);
    const sourceRef = useRef(null);

    const isEllipsisBase = p.ellipsis === "base";

    const setTruncatedHtml = useCallback(
        (nextHtml) => {
            setLocal((s) => {
                s.truncatedHtml = nextHtml;
            });
        },
        [setLocal],
    );

    const controlledProps = useMemo(() => {
        const responsiveProps = p.responsive?.[currentBreakpoint] || {};
        const mergedProps = { ...sysDefaults, ...p, ...responsiveProps };

        const { maxWidth, size, color, highlight, width } = mergedProps || {};

        const clr = colorGet(color || theme.foreground);
        const highlightClr = colorGet(highlight || clr.opposite);

        return {
            ...mergedProps,
            width: cssNormalizeSize(width),
            maxWidth: cssNormalizeSize(maxWidth),
            size: cssNormalizeSize(size),
            color: color ? clr.color : highlight ? highlightClr.opposite : theme.foreground,
            highlight: highlight ? colorGet(highlight || clr.opposite)?.color : undefined,
        };
    }, [p, currentBreakpoint, theme]);

    const recalculateTruncation = useCallback(() => {
        if (!isEllipsisBase || !ref.current || !sourceRef.current) {
            setTruncatedHtml(null);
            return;
        }

        const result = getTruncatedHtml({
            visibleRef: ref,
            sourceRef,
            clamp: p.clamp || 1,
            suffix: "...",
        });

        setTruncatedHtml(result?.isTruncated ? result.html : null);
    }, [isEllipsisBase, p.clamp, setTruncatedHtml]);

    useLayoutEffect(() => {
        recalculateTruncation();
    }, [recalculateTruncation, children, content]);

    useEffect(() => {
        if (!isEllipsisBase || !ref.current) return;

        const el = ref.current;
        const parent = el.parentElement;

        let frameId = null;

        const run = () => {
            if (frameId) cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                recalculateTruncation();
            });
        };

        const observer = new ResizeObserver(() => {
            run();
        });

        observer.observe(el);
        if (parent) observer.observe(parent);

        return () => {
            observer.disconnect();
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [isEllipsisBase, recalculateTruncation]);

    const margin = cssSpacingResolver(p, "margin");
    const padding = cssSpacingResolver(p, "padding");

    const finalVisibleContent = children ?? content;

    const hasNoContent =
        truncatedHtml == null &&
        !finalVisibleContent &&
        (!contentArray || contentArray.length === 0);

    const shouldRenderChildren = !isEllipsisBase || truncatedHtml == null;
    const shouldUseInnerHtml = isEllipsisBase && truncatedHtml != null;
    const shouldUseOverlayCopy = p.copyable && (p.ellipsis || p.clamp || shouldUseInnerHtml);
    const canUseInlineCopy = p.copyable && !shouldUseOverlayCopy && !shouldUseInnerHtml;

    return useExportData(
        {
            ...controlledProps,
            margin,
            padding,
            shouldUseOverlayCopy,
            shouldUseInnerHtml,
            isEllipsisBase,
            canUseInlineCopy,
            shouldRenderChildren,
            ref,
            sourceRef,
            truncatedHtml,
            finalVisibleContent,
            hasNoContent,
        },
        {},
    );
};

export default useVars;

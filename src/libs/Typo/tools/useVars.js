import { useMemo, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { useExportData } from "../../useExportedData";
import { colorGet } from "../../colorGet";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { baseStore } from "../../@baseStore";
import { getTruncatedHtml } from "./getTruncatedHtml";
import { cssSpacingResolver } from "../../cssSpacingResolver";
import { dedent, formatJsxPropsForViewer } from "../../DesignSystem/CodeViewer/tools/codeFormatters.jsx";

const sysDefaults = {
    as: "span",
    weight: 400,
    whiteSpace: "normal",
    overflow: "visible",
    letterSpacing: 0,
    lineHeight: 1.7,
    selfAlign: "left",
};

// useVars.js

const useVars = ({ children, content, contentArray, ...p }) => {
    const [theme, currentBreakpoint] = baseStore.useGlobal((s) => [
        s.theme,
        s._clientData.currentBreakpoint,
    ]);

    const { truncatedHtml, setLocal } = baseStore.useLocal({
        truncatedHtml: null,
    });

    const ref = useRef(null);

    const controlledProps = useMemo(() => {
        const responsiveProps = p.responsive?.[currentBreakpoint] || {};
        const mergedProps = { ...sysDefaults, ...p, ...responsiveProps };

        const { maxWidth, size, color, highlight, width } = mergedProps || {};

        const clr = colorGet(color || theme.foreground);
        const highlightClr = colorGet(highlight || clr.opposite);

        const enableQuoteMarks = !!mergedProps.enableQuoteMarks;

        return {
            ...mergedProps,
            ellipsis: enableQuoteMarks ? false : mergedProps.ellipsis,
            clamp: enableQuoteMarks ? false : mergedProps.clamp,
            width: cssNormalizeSize(width),
            maxWidth: cssNormalizeSize(maxWidth),
            size: cssNormalizeSize(size),
            color: color ? clr.color : highlight ? highlightClr.opposite : undefined,
            highlight: highlight ? colorGet(highlight || clr.opposite)?.color : undefined,
        };
    }, [p, currentBreakpoint, theme]);

    const setTruncatedHtml = useCallback(
        (nextHtml) => {
            setLocal((s) => {
                s.truncatedHtml = nextHtml;
            });
        },
        [setLocal],
    );

    const rawFinalVisibleContent = children ?? content;
    const finalVisibleContent = useMemo(() => {
        if (!controlledProps.codeFormat || typeof rawFinalVisibleContent !== "string") {
            return rawFinalVisibleContent;
        }

        const base = dedent(rawFinalVisibleContent);
        return controlledProps.codeFormatJsxProps === false ? base : formatJsxPropsForViewer(base);
    }, [
        rawFinalVisibleContent,
        controlledProps.codeFormat,
        controlledProps.codeFormatJsxProps,
    ]);
    const margin = cssSpacingResolver(p, "margin");
    const padding = cssSpacingResolver(p, "padding");
    const isEllipsisBaseFinal = controlledProps.ellipsis === "base";

    const recalculateTruncation = useCallback(() => {
        if (!isEllipsisBaseFinal || !ref.current) {
            setTruncatedHtml(null);
            return;
        }

        const result = getTruncatedHtml({
            visibleRef: ref,
            content: finalVisibleContent,
            as: controlledProps.as,
            clamp: controlledProps.clamp || 1,
            suffix: "...",
        });

        setTruncatedHtml(result?.isTruncated ? result.html : null);
    }, [
        isEllipsisBaseFinal,
        finalVisibleContent,
        controlledProps.as,
        controlledProps.clamp,
        setTruncatedHtml,
    ]);

    useLayoutEffect(() => {
        recalculateTruncation();
    }, [recalculateTruncation]);

    useEffect(() => {
        if (!isEllipsisBaseFinal || !ref.current) return;

        const el = ref.current;
        const parent = el.parentElement;

        let frameId = null;

        const run = () => {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                recalculateTruncation();
            });
        };

        const observer = new ResizeObserver(run);

        observer.observe(el);
        if (parent) observer.observe(parent);

        return () => {
            observer.disconnect();
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [isEllipsisBaseFinal, recalculateTruncation]);

    const hasNoContent =
        truncatedHtml == null &&
        !finalVisibleContent &&
        (!contentArray || contentArray.length === 0);

    const shouldRenderChildren = !isEllipsisBaseFinal || truncatedHtml == null;
    const shouldUseInnerHtml = isEllipsisBaseFinal && truncatedHtml != null;
    const shouldUseOverlayCopy =
        p.copyable && (controlledProps.ellipsis || controlledProps.clamp || shouldUseInnerHtml);
    const canUseInlineCopy = p.copyable && !shouldUseOverlayCopy && !shouldUseInnerHtml;

    return useExportData(
        {
            ...controlledProps,
            margin,
            padding,
            shouldUseOverlayCopy,
            shouldUseInnerHtml,
            isEllipsisBase: isEllipsisBaseFinal,
            canUseInlineCopy,
            shouldRenderChildren,
            ref,
            truncatedHtml,
            finalVisibleContent,
            hasNoContent,
        },
        {},
    );
};

export default useVars;

import { useMemo, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { useExportData } from "../../useExportedData";
import { colorGet } from "../../colorGet";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { baseStore } from "../../@baseStore";
import { getTruncatedHtml } from "./getTruncatedHtml";
import { cssSpacingResolver } from "../../cssSpacingResolver";
import { dedent } from "../../templateLiteralTo/dedent";
import {
    formatFnCallSnippetForViewer,
    formatJsxPropsForViewer,
} from "../../DesignSystem/CodeViewer/tools/codeFormatters.jsx";
import { useNestedBaseUiContext, NESTED_UI_TYPO_PHRASING_HOST } from "../../NestedBaseUi";

const sysDefaults = {
    as: "span",
    weight: 400,
    whiteSpace: "normal",
    overflow: "visible",
    letterSpacing: 0,
    lineHeight: 1.7,
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

    const nestedUi = useNestedBaseUiContext();

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

    const displayProps = useMemo(() => {
        const underPhrasingHost = nestedUi?.[NESTED_UI_TYPO_PHRASING_HOST];
        if (underPhrasingHost && controlledProps.as === "pre") {
            return { ...controlledProps, as: "code" };
        }
        return controlledProps;
    }, [controlledProps, nestedUi]);

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
        const jsxDone =
            controlledProps.codeFormatJsxProps === false ? base : formatJsxPropsForViewer(base);
        if (controlledProps.codeFormatCalls === false) return jsxDone;
        return formatFnCallSnippetForViewer(jsxDone);
    }, [
        rawFinalVisibleContent,
        controlledProps.codeFormat,
        controlledProps.codeFormatJsxProps,
        controlledProps.codeFormatCalls,
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
            as: displayProps.as,
            clamp: displayProps.clamp || 1,
            suffix: "...",
        });

        setTruncatedHtml(result?.isTruncated ? result.html : null);
    }, [
        isEllipsisBaseFinal,
        finalVisibleContent,
        displayProps.as,
        displayProps.clamp,
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
    const isOverlayCopyHost = displayProps.as === "pre" || displayProps.as === "code";
    const hasCopy = !!p.copy;
    const shouldUseOverlayCopy =
        hasCopy &&
        (controlledProps.ellipsis ||
            controlledProps.clamp != null ||
            shouldUseInnerHtml ||
            isOverlayCopyHost);
    const canUseInlineCopy = hasCopy && !shouldUseOverlayCopy && !shouldUseInnerHtml;

    return useExportData(
        {
            ...displayProps,
            copy: hasCopy,
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

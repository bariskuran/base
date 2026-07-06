import { isValidElement, useMemo, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { useExportData } from "helpers/useExportedData";
import { colorGet } from "../../colorGet";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { baseStore } from "../../baseStore";
import { getTruncatedHtml } from "./getTruncatedHtml";
import { cssSpacingResolver } from "../../cssSpacingResolver";
import { dedent } from "../../templateLiteralTo/dedent";
import {
    formatFnCallSnippetForViewer,
    formatJsxPropsForViewer,
} from "../../DesignSystem/CodeViewer/tools/codeFormatters.jsx";
import { coerceToCodeText } from "../../DesignSystem/formatJsonForDisplay";
import { useNestedBaseUiContext, NESTED_UI_TYPO_PHRASING_HOST } from "helpers/NestedBaseUi";
import { getCssDeclarationValue, stripCssImports } from "../../@Base/styling/fontCss";

const sysDefaults = {
    as: "span",
    weight: 400,
    whiteSpace: "normal",
    overflow: "visible",
    letterSpacing: 0,
    lineHeight: 1.7,
};

const baseSizeByTag = {
    h1: "190%",
    h2: "175%",
    h3: "160%",
    h4: "145%",
    h5: "130%",
    h6: "115%",
    blockquote: "110%",
};

const getPercentNumber = (value) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    const match = /^(\d+(?:\.\d+)?)%?$/.exec(trimmed);
    if (!match) return null;
    return Number(match[1]);
};

const formatPercent = (value) => {
    const rounded = Math.round(value * 10000) / 10000;
    return `${rounded}%`;
};

const isScaleLikeSize = (value) => {
    const pct = getPercentNumber(value);
    if (pct == null) return false;

    return (
        (typeof value === "string" && value.trim().endsWith("%")) ||
        (pct >= 50 && pct <= 300)
    );
};

const resolveTypoSize = (size, baseSize) => {
    if (size == null) return cssNormalizeSize(size);
    if (!baseSize) return cssNormalizeSize(size);

    const basePct = getPercentNumber(baseSize);
    const sizePct = getPercentNumber(size);

    if (basePct == null || sizePct == null) return cssNormalizeSize(size);

    const isExplicitPercent = typeof size === "string" && size.trim().endsWith("%");
    const isScaleLikeNumber = typeof size === "number" && sizePct >= 50 && sizePct <= 300;
    const isScaleLikeNumericString =
        typeof size === "string" && !size.trim().endsWith("%") && sizePct >= 50 && sizePct <= 300;

    if (!isExplicitPercent && !isScaleLikeNumber && !isScaleLikeNumericString) {
        return cssNormalizeSize(size);
    }

    if (isExplicitPercent && sizePct === basePct) return formatPercent(basePct);

    return formatPercent((basePct * sizePct) / 100);
};

const resolveTypoBaseSize = ({ size, baseSize, as }) => {
    if (baseSize) return baseSize;
    if (!isScaleLikeSize(size)) return null;
    return baseSizeByTag[as] || null;
};

const useVars = ({ children, content, contentGroup, ...p }) => {
    const [theme, currentBreakpoint, fonts] = baseStore.useGlobal((s) => [
        s.theme,
        s._clientData.currentBreakpoint,
        s._projectSettings?.styledSettings?.fonts,
    ]);
    const font = p.fontFamily ? stripCssImports(fonts?.[p.fontFamily]) : null;
    const fontStyle = font
        ? { fontFamily: getCssDeclarationValue(font, "font-family") }
        : null;

    const { truncatedHtml, set } = baseStore.useLocal({
        truncatedHtml: null,
    });

    const ref = useRef(null);

    const nestedUi = useNestedBaseUiContext();

    const controlledProps = useMemo(() => {
        const responsiveProps = p.responsive?.[currentBreakpoint] || {};
        const mergedProps = { ...sysDefaults, ...p, ...responsiveProps };

        const { maxWidth, size, _baseSize, color, highlight, width, full, ...restMerged } =
            mergedProps || {};

        const clr = colorGet(color || theme.foreground);
        const highlightClr = colorGet(highlight || clr.opposite);
        const typoBaseSize = resolveTypoBaseSize({
            size,
            baseSize: _baseSize,
            as: restMerged.as,
        });

        const enableQuoteMarks = !!restMerged.enableQuoteMarks;

        const resolvedWidth =
            full === true && (width == null || width === undefined) ? "100%" : width;

        return {
            ...restMerged,
            ellipsis: enableQuoteMarks ? false : restMerged.ellipsis,
            clamp: enableQuoteMarks ? false : restMerged.clamp,
            width: cssNormalizeSize(resolvedWidth),
            maxWidth: cssNormalizeSize(maxWidth),
            size: resolveTypoSize(size, typoBaseSize),
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
            set((s) => {
                s.truncatedHtml = nextHtml;
            });
        },
        [set],
    );

    const rawFinalVisibleContent = children ?? content;
    const finalVisibleContent = useMemo(() => {
        const isCodeHost = displayProps.as === "pre" || displayProps.as === "code";
        const shouldCoerce =
            isCodeHost &&
            rawFinalVisibleContent != null &&
            typeof rawFinalVisibleContent !== "string" &&
            !isValidElement(rawFinalVisibleContent) &&
            !(Array.isArray(rawFinalVisibleContent) && rawFinalVisibleContent.some(isValidElement));

        const workingContent = shouldCoerce
            ? coerceToCodeText(rawFinalVisibleContent)
            : rawFinalVisibleContent;

        if (!controlledProps.codeFormat || typeof workingContent !== "string") {
            return workingContent;
        }

        const base = dedent(workingContent);
        const jsxDone =
            controlledProps.codeFormatJsxProps === false ? base : formatJsxPropsForViewer(base);
        if (controlledProps.codeFormatCalls === false) return jsxDone;
        return formatFnCallSnippetForViewer(jsxDone);
    }, [
        rawFinalVisibleContent,
        displayProps.as,
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
        (!contentGroup || contentGroup.length === 0);

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
    const shouldUseStackedOverlayCopy =
        shouldUseOverlayCopy &&
        isOverlayCopyHost &&
        controlledProps.clamp == null &&
        !controlledProps.ellipsis &&
        !shouldUseInnerHtml;

    return useExportData(
        {
            ...displayProps,
            copy: hasCopy,
            margin,
            padding,
            shouldUseOverlayCopy,
            shouldUseStackedOverlayCopy,
            shouldUseInnerHtml,
            isEllipsisBase: isEllipsisBaseFinal,
            canUseInlineCopy,
            shouldRenderChildren,
            font,
            fontStyle,
            ref,
            truncatedHtml,
            finalVisibleContent,
            hasNoContent,
        },
        {},
    );
};

export default useVars;

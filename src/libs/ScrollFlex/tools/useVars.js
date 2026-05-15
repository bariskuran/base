import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { baseStore } from "../../@baseStore";
import { useExportData } from "../../useExportedData";
import { isShallowEqual } from "../../isShallowEqual";
import { mergeFlexKebabPropAliases, FLEX_PROPS_KEBAB_TO_CAMEL } from "../../Flex/tools/generateProps.js";
import { computeDragScrollFromPointers } from "./computeDragScrollDelta";

const EMPTY_FLEX_PROPS = {};
const EMPTY_SCROLL_BAR_PROPS = {};

const lockShellTextSelection = (el) => {
    if (!el) return;
    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";
    el.style.MozUserSelect = "none";
};

const unlockShellTextSelection = (el) => {
    if (!el) return;
    el.style.userSelect = "";
    el.style.webkitUserSelect = "";
    el.style.MozUserSelect = "";
};

const pickScrollBarLayoutData = (data = {}) => ({
    showX: !!data.showX,
    showY: !!data.showY,
    top: !!data.top,
    bottom: !!data.bottom,
    left: !!data.left,
    right: !!data.right,
    edgeMargin: data.edgeMargin,
    thickness: data.thickness,
});

const getCssSize = (value) => {
    if (value == null) return "0";
    if (value === 0 || value === "0") return "0";
    if (typeof value === "number") return `${value}rem`;

    const v = String(value).trim().replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(v)) return `${v}rem`;
    return normalizeCalcValue(v);
};

/** Ölçülen px değerleri ve birimli stringler rem'e çevrilmeden kalır. */
const getLayoutSizeCss = (value) => {
    if (value == null || value === "") return undefined;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (/^-?\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|dvw|dvh)$/i.test(trimmed)) {
            return normalizeCalcValue(trimmed);
        }
        if (/^calc\(/i.test(trimmed) || /min\(|max\(/i.test(trimmed)) {
            return normalizeCalcValue(trimmed);
        }
    }
    return getCssSize(value);
};

const remToPx = (remValue) => {
    const rem = Number(remValue);
    if (!Number.isFinite(rem)) return 0;
    if (typeof document === "undefined") return rem * 16;
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return rem * (Number.isFinite(rootPx) && rootPx > 0 ? rootPx : 16);
};

/**
 * ScrollBar track'inin host içinde kapladığı yatay/dikey pay (px).
 * ScrollBar sayıları rem ile render edilir; küçük varsayılanlar (|edge|+thickness)
 * tarihsel olarak px olarak shell'de kullanılıyordu — ikisini hizalarız.
 */
const getBarAxisGutterPx = (scrollBarData, scrollBarProps) => {
    const thickness = Number(
        scrollBarData?.thickness ?? scrollBarProps?.thickness ?? 4,
    );
    const edgeMargin = Number(
        scrollBarData?.edgeMargin ??
            scrollBarProps?.edgeMargin ??
            scrollBarProps?.edgeMarginX ??
            scrollBarProps?.edgeMarginY ??
            -4 - thickness,
    );

    if (!Number.isFinite(thickness)) return 9;

    const thicknessPx = remToPx(thickness);
    if (!Number.isFinite(edgeMargin)) {
        return Math.round(thicknessPx);
    }

    const edgePx = remToPx(edgeMargin);
    const overlapPx = Math.max(0, thicknessPx + edgePx);
    const legacyPx = Math.abs(edgeMargin) + thickness;

    if (Math.abs(edgeMargin) <= 24 && thickness <= 24) {
        return Math.round(legacyPx);
    }

    return Math.round(Math.max(thicknessPx, overlapPx));
};

const getContainerBorderInsetsPx = (node) => {
    if (!node || typeof getComputedStyle === "undefined") {
        return { x: 0, y: 0 };
    }
    const cs = getComputedStyle(node);
    return {
        x: (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0),
        y: (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0),
    };
};

const normalizeCalcValue = (value) =>
    typeof value === "string"
        ? value.replace(
              /calc\((.*)\)/g,
              (_, expression) => `calc(${expression.replace(/\s*([+\-*/])\s*/g, " $1 ")})`,
          )
        : value;

/**
 * Shell padding: kısaltma değerleri boşluk içerir; getCssSize boşlukları sildiği için
 * "10px 0 10px 10px" gibi değerler bozuluyordu.
 */
const getShellPaddingCssValue = (value) => {
    if (value == null) return null;
    if (value === 0 || value === "0") return "0";
    if (typeof value === "number") return `${value}rem`;

    const raw = String(value).trim();
    if (!raw) return null;

    const singleToken = raw.replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(singleToken)) return `${singleToken}rem`;

    const spaced = raw.replace(/\s+/g, " ").trim();
    if (/^calc\(/i.test(spaced)) return normalizeCalcValue(spaced);
    return normalizeCalcValue(spaced);
};

/** ScrollFlex kökündeki padding anahtarları (camel + Flex kebab aliasları + style içi). */
const PADDING_CAMEL_KEYS = [
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "paddingBlock",
    "paddingInline",
    "paddingBlockStart",
    "paddingBlockEnd",
    "paddingInlineStart",
    "paddingInlineEnd",
];

const PADDING_CAMEL_SET = new Set(PADDING_CAMEL_KEYS);

const styleKeyToPaddingCamel = (k) => {
    if (typeof k !== "string") return null;
    if (PADDING_CAMEL_SET.has(k)) return k;
    if (!k.startsWith("padding")) return null;
    if (!k.includes("-")) return null;
    const camel = k.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    return PADDING_CAMEL_SET.has(camel) ? camel : null;
};

const buildShellPaddingStyleFromMerged = (merged) => {
    const shell = {};
    for (const key of PADDING_CAMEL_KEYS) {
        if (merged[key] == null) continue;
        const css = getShellPaddingCssValue(merged[key]);
        if (css != null) shell[key] = css;
    }
    return shell;
};

/**
 * Sadece ScrollFlex'e verilen (rest) props'tan padding'i ayırır → shell inline style.
 * flexProps padding'a dokunulmaz; içerik {...flexProps} ile alır.
 */
const splitShellPaddingFromRestProps = (restProps) => {
    if (!restProps || typeof restProps !== "object") {
        return { shellPaddingStyle: {}, restPropsWithoutShellPadding: {} };
    }

    const mergedTop = mergeFlexKebabPropAliases(restProps);
    let shellPaddingStyle = buildShellPaddingStyleFromMerged(mergedTop);

    const next = { ...restProps };
    for (const key of PADDING_CAMEL_KEYS) {
        delete next[key];
    }
    for (const [kebab, camel] of Object.entries(FLEX_PROPS_KEBAB_TO_CAMEL)) {
        if (PADDING_CAMEL_SET.has(camel)) delete next[kebab];
    }

    if (next.style && typeof next.style === "object") {
        const nextStyle = { ...next.style };
        for (const k of Object.keys(nextStyle)) {
            const camel = styleKeyToPaddingCamel(k);
            if (camel == null) continue;
            const val = nextStyle[k];
            if (val != null && shellPaddingStyle[camel] == null) {
                const css = getShellPaddingCssValue(val);
                if (css != null) {
                    shellPaddingStyle = { ...shellPaddingStyle, [camel]: css };
                }
            }
            delete nextStyle[k];
        }
        if (Object.keys(nextStyle).length) next.style = nextStyle;
        else delete next.style;
    }

    if (Object.keys(shellPaddingStyle).length === 0) shellPaddingStyle = {};

    return { shellPaddingStyle, restPropsWithoutShellPadding: next };
};

const mergeDefaultAlignment = (props) => {
    const hasDirectJustify = props.justify != null || props.justifyContent != null;
    const hasDirectAlign = props.alignItems != null || props.align != null;
    const hasAxisAlign = props.xAlign != null || props.yAlign != null;

    if (hasAxisAlign) {
        return {
            ...props,
            ...(props.xAlign == null && !hasDirectJustify ? { xAlign: "start" } : {}),
            ...(props.yAlign == null && !hasDirectAlign ? { yAlign: "start" } : {}),
        };
    }

    return {
        ...props,
        ...(hasDirectJustify ? {} : { justify: "start" }),
        ...(hasDirectAlign ? {} : { align: "start" }),
    };
};

const getExplicitHeight = ({ height, flexProps }) => height ?? flexProps.height;
const getExplicitWidth = ({ width, flexProps, restProps }) =>
    width ?? flexProps.width ?? restProps.width;
const getRefElement = (ref) => ref?.current || ref || null;
const getShellLayoutStyle = (scrollBarData, scrollBarProps) => {
    const barSpace = getBarAxisGutterPx(scrollBarData, scrollBarProps);

    const hasVerticalBarEdge = !!(scrollBarData?.top || scrollBarData?.bottom);
    const hasHorizontalBarEdge = !!(scrollBarData?.left || scrollBarData?.right);

    return {
        width: hasHorizontalBarEdge ? `calc(100% - ${barSpace}px)` : "100%",
        height: hasVerticalBarEdge ? `calc(100% - ${barSpace}px)` : "100%",
        ...(scrollBarData?.top ? { alignSelf: "end" } : {}),
        ...(scrollBarData?.left ? { justifySelf: "end" } : {}),
    };
};

const isUsableHeightValue = (value) => {
    if (!value) return false;

    const v = String(value).trim();
    if (v.includes("%")) return false;
    return !["auto", "initial", "inherit", "unset", "0", "0px"].includes(v);
};

const getRuleHeight = (node) => {
    if (typeof document === "undefined") return null;

    for (const sheet of Array.from(document.styleSheets || [])) {
        let rules;

        try {
            rules = sheet.cssRules;
        } catch {
            continue;
        }

        for (const rule of Array.from(rules || [])) {
            if (!rule.selectorText || !rule.style?.height) continue;

            try {
                if (node.matches(rule.selectorText)) {
                    return rule.style.height;
                }
            } catch {
                continue;
            }
        }
    }

    return null;
};

const getAuthoredHeight = (node) => node?.style?.height || getRuleHeight(node);

const getParentHeightWithoutSelf = (node) => {
    const parent = node?.parentElement;
    if (!node || !parent) return 0;

    const previousDisplay = node.style.display;
    node.style.display = "none";
    const parentHeight = parent.getBoundingClientRect().height;
    node.style.display = previousDisplay;

    return parentHeight;
};

const getParentWidthWithoutSelf = (node) => {
    const parent = node?.parentElement;
    if (!node || !parent) return 0;

    const previousDisplay = node.style.display;
    node.style.display = "none";
    const parentWidth = parent.getBoundingClientRect().width;
    node.style.display = previousDisplay;

    return parentWidth;
};

const measureContentAxisPx = (el, axis) => {
    if (!el?.getBoundingClientRect) return 0;
    const rect = el.getBoundingClientRect();
    const layout = Math.round(axis === "x" ? rect.width || 0 : rect.height || 0);
    const scroll = Math.round(axis === "x" ? el.scrollWidth || 0 : el.scrollHeight || 0);
    return Math.max(layout, scroll);
};

const parseCssLengthToPx = (value, baseFontSize = 16) => {
    if (value == null || value === "") return 0;
    const raw = String(value).trim();
    if (raw === "0") return 0;
    if (/^-?\d+(\.\d+)?px$/i.test(raw)) return parseFloat(raw);
    if (/^-?\d+(\.\d+)?rem$/i.test(raw)) return remToPx(parseFloat(raw));
    if (/^-?\d+(\.\d+)?em$/i.test(raw)) return parseFloat(raw) * baseFontSize;
    if (/^-?\d+(\.\d+)?$/.test(raw)) return remToPx(parseFloat(raw));
    return 0;
};

const expandPaddingShorthandPx = (parts) => {
    if (!parts.length) return [0, 0, 0, 0];
    if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
    if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
    if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
    return [parts[0], parts[1], parts[2], parts[3]];
};

/** ScrollFlex padding prop → shell inline style; yatay/dikey toplam px. */
const getShellPaddingInsetsPx = (shellPaddingStyle) => {
    if (!shellPaddingStyle || typeof shellPaddingStyle !== "object") {
        return { x: 0, y: 0 };
    }

    let top = 0;
    let right = 0;
    let bottom = 0;
    let left = 0;
    const p = shellPaddingStyle;

    if (p.padding != null) {
        const parts = String(p.padding)
            .trim()
            .split(/\s+/)
            .map(parseCssLengthToPx);
        [top, right, bottom, left] = expandPaddingShorthandPx(parts);
    }
    if (p.paddingTop != null) top = parseCssLengthToPx(p.paddingTop);
    if (p.paddingRight != null) right = parseCssLengthToPx(p.paddingRight);
    if (p.paddingBottom != null) bottom = parseCssLengthToPx(p.paddingBottom);
    if (p.paddingLeft != null) left = parseCssLengthToPx(p.paddingLeft);

    if (p.paddingBlock != null) {
        const parts = String(p.paddingBlock)
            .trim()
            .split(/\s+/)
            .map(parseCssLengthToPx);
        const [blockStart, blockEnd] =
            parts.length === 1 ? [parts[0], parts[0]] : [parts[0], parts[1] ?? parts[0]];
        top = blockStart;
        bottom = blockEnd;
    }
    if (p.paddingInline != null) {
        const parts = String(p.paddingInline)
            .trim()
            .split(/\s+/)
            .map(parseCssLengthToPx);
        const [inlineStart, inlineEnd] =
            parts.length === 1 ? [parts[0], parts[0]] : [parts[0], parts[1] ?? parts[0]];
        left = inlineStart;
        right = inlineEnd;
    }
    if (p.paddingBlockStart != null) top = parseCssLengthToPx(p.paddingBlockStart);
    if (p.paddingBlockEnd != null) bottom = parseCssLengthToPx(p.paddingBlockEnd);
    if (p.paddingInlineStart != null) left = parseCssLengthToPx(p.paddingInlineStart);
    if (p.paddingInlineEnd != null) right = parseCssLengthToPx(p.paddingInlineEnd);

    return {
        x: Math.round(left + right),
        y: Math.round(top + bottom),
    };
};

const getPaddingInsetsFromElement = (el) => {
    if (!el || typeof getComputedStyle === "undefined") {
        return { x: 0, y: 0 };
    }
    const cs = getComputedStyle(el);
    return {
        x: Math.round(
            (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0),
        ),
        y: Math.round(
            (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0),
        ),
    };
};

/** Sıkışmış layout'tan kaçınmak için geçici intrinsic ölçüm. */
const measureContentIntrinsicAxisPx = (el, axis) => {
    if (!el?.getBoundingClientRect) return 0;
    const isX = axis === "x";
    const saved = {
        width: el.style.width,
        maxWidth: el.style.maxWidth,
        minWidth: el.style.minWidth,
        height: el.style.height,
        maxHeight: el.style.maxHeight,
        minHeight: el.style.minHeight,
        alignSelf: el.style.alignSelf,
    };

    try {
        if (isX) {
            el.style.width = "max-content";
            el.style.maxWidth = "none";
            el.style.minWidth = "0";
            el.style.alignSelf = "flex-start";
        } else {
            el.style.height = "max-content";
            el.style.maxHeight = "none";
            el.style.minHeight = "0";
        }
        return measureContentAxisPx(el, axis);
    } finally {
        el.style.width = saved.width;
        el.style.maxWidth = saved.maxWidth;
        el.style.minWidth = saved.minWidth;
        el.style.height = saved.height;
        el.style.maxHeight = saved.maxHeight;
        el.style.minHeight = saved.minHeight;
        el.style.alignSelf = saved.alignSelf;
    }
};

const getBarGutterInsets = (scrollBarData, scrollBarProps) => {
    const gutter = getBarAxisGutterPx(scrollBarData, scrollBarProps);
    return {
        gutterX: scrollBarData?.left || scrollBarData?.right ? gutter : 0,
        gutterY: scrollBarData?.top || scrollBarData?.bottom ? gutter : 0,
    };
};

/** Shell max değeri → container max = max + bar payı (durum 3). */
const addBarGutterToCssSize = (size, gutterPx) => {
    if (size == null || size === "") return undefined;
    if (!gutterPx) return getLayoutSizeCss(size);
    return normalizeCalcValue(`calc(${getLayoutSizeCss(size)} + ${gutterPx}px)`);
};

/**
 * İçerik parent'tan küçükse içerik (+ çubuk payı); büyükse parent.
 * parent yoksa fallbackPx; parent varken max %100 ile sınırla.
 */
const resolveAutoAxisPx = ({
    contentPx,
    parentPx,
    barGutterPx,
    reserveBarGutter,
    fallbackPx,
    borderInsetPx = 0,
}) => {
    const content = Math.max(0, contentPx);
    const parent = Math.max(0, parentPx);
    const gutter = reserveBarGutter ? Math.max(0, barGutterPx) : 0;
    const border = Math.max(0, borderInsetPx);

    if (parent <= 0 && content <= 0) {
        return { px: fallbackPx, capToParentPercent: false };
    }
    if (parent <= 0) {
        return { px: Math.round(content + gutter + border), capToParentPercent: false };
    }
    if (content <= parent) {
        return { px: Math.round(content + gutter + border), capToParentPercent: true };
    }
    return { px: Math.round(parent), capToParentPercent: true };
};

const getAncestorAuthoredHeightWithoutSelf = (node) => {
    if (!node) return 0;

    const previousDisplay = node.style.display;
    node.style.display = "none";

    let current = node.parentElement;
    let height = 0;

    while (current && current !== document.body && current !== document.documentElement) {
        if (isUsableHeightValue(getAuthoredHeight(current))) {
            height = current.getBoundingClientRect().height;
            break;
        }

        current = current.parentElement;
    }

    node.style.display = previousDisplay;

    return height;
};

const getRefSize = ({ ref, axis }) => {
    const el = getRefElement(ref);
    if (!el?.getBoundingClientRect) return null;

    const rect = el.getBoundingClientRect();
    const value = axis === "x" ? rect.width : rect.height;

    return value > 0 ? `${value}px` : null;
};

const useVars = (p) => {
    const {
        Variant,
        flexProps = EMPTY_FLEX_PROPS,
        width,
        height,
        maxHeight,
        maxWidth,
        widthByRef,
        heightByRef,
        widthById,
        heightById,
        autoWidth,
        autoHeight,
        scrollBarProps = EMPTY_SCROLL_BAR_PROPS,
        exportData: scrollBoxExportData,
        __hasParentUiComponent,
        enableDragging = false,
        ...restProps
    } = p || {};

    const { shellPaddingStyle, restPropsWithoutShellPadding } = useMemo(
        () => splitShellPaddingFromRestProps(restProps),
        [restProps],
    );

    const explicitWidthValue = getExplicitWidth({
        width,
        flexProps,
        restProps: restPropsWithoutShellPadding,
    });
    const hasWidthRefOrId =
        !!widthByRef || (typeof widthById === "string" && widthById.trim() !== "");
    const intrinsicWidth =
        (explicitWidthValue == null || explicitWidthValue === "") && !hasWidthRefOrId;

    const hasHeightRefOrId =
        !!heightByRef || (typeof heightById === "string" && heightById.trim() !== "");

    const hasExplicitContainerHeight =
        (height != null && height !== "") ||
        hasHeightRefOrId ||
        (flexProps.height != null && flexProps.height !== "");

    const hasExplicitContainerWidth =
        (width != null && width !== "") ||
        hasWidthRefOrId ||
        (explicitWidthValue != null && explicitWidthValue !== "");

    const autoHeightEnabled = autoHeight !== false && !hasExplicitContainerHeight;
    const autoWidthEnabled = autoWidth !== false && !hasExplicitContainerWidth;

    const containerRef = useRef(null);
    const shellRef = useRef(null);
    const contentRef = useRef(null);
    const dragRef = useRef({ active: false, x0: 0, y0: 0, s0l: 0, s0t: 0, pid: null });
    const [shellDragging, setShellDragging] = useState(false);
    const [theme] = baseStore.useGlobal((s) => [s.theme]);
    const {
        measuredWidth,
        measuredHeight,
        hasMeasuredHeight,
        contentWidthPx,
        contentHeightPx,
        containerBorderInsetsPx,
        autoHeightCapsToParent,
        autoWidthCapsToParent,
        scrollBarExportedData,
        setLocal,
    } = baseStore.useLocal({
        measuredWidth: null,
        measuredHeight: null,
        hasMeasuredHeight: false,
        contentWidthPx: 0,
        contentHeightPx: 0,
        containerBorderInsetsPx: { x: 0, y: 0 },
        autoHeightCapsToParent: false,
        autoWidthCapsToParent: false,
        scrollBarExportedData: pickScrollBarLayoutData(),
    });

    const userScrollBarExportData = scrollBarProps?.exportData;
    const exportData = useCallback(
        (data) => {
            const nextLayoutData = pickScrollBarLayoutData(data);

            setLocal((s) => {
                if (isShallowEqual(s.scrollBarExportedData, nextLayoutData)) return;
                s.scrollBarExportedData = nextLayoutData;
            });

            if (typeof userScrollBarExportData === "function") {
                userScrollBarExportData(data);
            }
        },
        [setLocal, userScrollBarExportData],
    );

    const mergedScrollBarProps = useMemo(
        () => ({
            ...scrollBarProps,
            exportData,
        }),
        [scrollBarProps, exportData],
    );

    const effectiveEnableDragging = enableDragging && !mergedScrollBarProps.fillMode;

    const organizedFlexProps = useMemo(() => {
        const explicitHeight = getExplicitHeight({
            height,
            flexProps,
        });
        const explicitWidth = getExplicitWidth({
            width,
            flexProps,
            restProps: restPropsWithoutShellPadding,
        });
        const resolvedHeight = explicitHeight ?? measuredHeight;

        const shouldRender =
            intrinsicWidth ||
            explicitHeight != null ||
            measuredHeight != null ||
            !hasMeasuredHeight ||
            (hasMeasuredHeight && explicitHeight == null && measuredHeight == null);

        const style = {
            ...(restPropsWithoutShellPadding.style || {}),
            ...(flexProps.style || {}),
            ...(explicitHeight != null ? { maxHeight: "100vh" } : {}),
        };

        if (explicitWidth != null && style.width == null) {
            style.width = getCssSize(explicitWidth);
        }

        const mergedFlexProps = {
            ...restPropsWithoutShellPadding,
            ...flexProps,
            ...(shouldRender && resolvedHeight != null && resolvedHeight !== ""
                ? { height: resolvedHeight }
                : {}),
            style,
        };

        const alignedFlexProps = mergeDefaultAlignment(mergedFlexProps);

        const shellHeightBounded =
            hasExplicitContainerHeight ||
            (maxHeight != null && maxHeight !== "") ||
            (autoHeightEnabled && measuredHeight != null && measuredHeight !== "");

        const hasBoundedScrollHeight = shouldRender && shellHeightBounded;

        const resolvedContentFlexProps = hasBoundedScrollHeight
            ? (() => {
                  const {
                      height: _omitHeight,
                      maxHeight: _omitMaxHeight,
                      style: alignedStyle,
                      ...restAligned
                  } = alignedFlexProps;
                  const nextStyle = { ...(alignedStyle || {}) };
                  delete nextStyle.height;
                  delete nextStyle.maxHeight;
                  if (nextStyle.minHeight == null && nextStyle.minBlockSize == null) {
                      nextStyle.minHeight = "100%";
                  }
                  return { ...restAligned, style: nextStyle };
              })()
            : alignedFlexProps;

        return {
            shouldRender,
            flexProps: resolvedContentFlexProps,
        };
    }, [
        autoHeightEnabled,
        flexProps,
        hasMeasuredHeight,
        hasExplicitContainerHeight,
        height,
        maxHeight,
        intrinsicWidth,
        measuredHeight,
        restPropsWithoutShellPadding,
        width,
    ]);

    const barGutters = useMemo(
        () => getBarGutterInsets(scrollBarExportedData, scrollBarProps),
        [scrollBarExportedData, scrollBarProps],
    );

    const shellPaddingInsetsPx = useMemo(
        () => getShellPaddingInsetsPx(shellPaddingStyle),
        [shellPaddingStyle],
    );

    const hasMaxWidthBound =
        maxWidth !== undefined && maxWidth !== null && maxWidth !== "";
    const hasMaxHeightBound =
        maxHeight !== undefined && maxHeight !== null && maxHeight !== "";

    const contentFillsShellWidth =
        hasExplicitContainerWidth || autoWidthEnabled || hasMaxWidthBound;
    const contentFillsShellHeight =
        hasExplicitContainerHeight || autoHeightEnabled || hasMaxHeightBound;

    const contentLayoutStyle = useMemo(() => {
        const style = {};
        if (!contentFillsShellWidth) {
            style.width = "max-content";
            style.maxWidth = "none";
            style.alignSelf = "flex-start";
        }
        if (!contentFillsShellHeight) {
            style.height = "max-content";
            style.maxHeight = "none";
        }
        return Object.keys(style).length ? style : undefined;
    }, [contentFillsShellHeight, contentFillsShellWidth]);

    const getContainerExtraInsetPx = useCallback(
        (axis) => {
            const gutter = axis === "x" ? barGutters.gutterX : barGutters.gutterY;
            const pad = axis === "x" ? shellPaddingInsetsPx.x : shellPaddingInsetsPx.y;
            const border =
                axis === "x" ? containerBorderInsetsPx.x : containerBorderInsetsPx.y;
            return gutter + pad + border;
        },
        [barGutters, containerBorderInsetsPx, shellPaddingInsetsPx],
    );

    const needsShellViewport = useMemo(() => {
        const hasMaxW = maxWidth !== undefined && maxWidth !== null && maxWidth !== "";
        const hasMaxH = maxHeight !== undefined && maxHeight !== null && maxHeight !== "";
        return (
            hasExplicitContainerWidth ||
            hasExplicitContainerHeight ||
            hasMaxW ||
            hasMaxH ||
            autoWidthEnabled ||
            autoHeightEnabled ||
            contentWidthPx > 0 ||
            contentHeightPx > 0
        );
    }, [
        autoHeightEnabled,
        autoWidthEnabled,
        contentHeightPx,
        contentWidthPx,
        hasExplicitContainerHeight,
        hasExplicitContainerWidth,
        maxHeight,
        maxWidth,
    ]);

    /** Durum 3: maxW/maxH shell'de; shell viewport container içinde calc ile bar payı bırakır. */
    const shellViewportStyle = useMemo(() => {
        if (!needsShellViewport) return undefined;

        const style = {
            flex: "1 1 0",
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
        };

        if (maxWidth !== undefined && maxWidth !== null && maxWidth !== "" && !hasExplicitContainerWidth) {
            style.maxWidth = getLayoutSizeCss(maxWidth);
        }
        if (
            maxHeight !== undefined &&
            maxHeight !== null &&
            maxHeight !== "" &&
            !hasExplicitContainerHeight
        ) {
            style.maxHeight = getLayoutSizeCss(maxHeight);
        }

        return style;
    }, [
        hasExplicitContainerHeight,
        hasExplicitContainerWidth,
        maxHeight,
        maxWidth,
        needsShellViewport,
    ]);

    const containerGridStyle = useMemo(() => {
        if (!needsShellViewport) return undefined;
        return {
            gridTemplateRows: "minmax(0, 1fr)",
            gridTemplateColumns: "minmax(0, 1fr)",
            minHeight: 0,
            minWidth: 0,
        };
    }, [needsShellViewport]);

    const shellLayoutStyle = useMemo(
        () => getShellLayoutStyle(scrollBarExportedData, scrollBarProps),
        [scrollBarExportedData, scrollBarProps],
    );

    useLayoutEffect(() => {
        if (hasExplicitContainerWidth && hasExplicitContainerHeight) return;

        const syncContentSize = () => {
            const content = contentRef.current;
            const container = containerRef.current;
            if (!content) return;

            const border = container
                ? getContainerBorderInsetsPx(container)
                : { x: 0, y: 0 };
            const nextW = hasExplicitContainerWidth
                ? null
                : measureContentIntrinsicAxisPx(content, "x");
            const nextH = hasExplicitContainerHeight
                ? null
                : measureContentIntrinsicAxisPx(content, "y");

            setLocal((s) => {
                if (nextW != null && s.contentWidthPx !== nextW) {
                    s.contentWidthPx = nextW;
                }
                if (nextH != null && s.contentHeightPx !== nextH) {
                    s.contentHeightPx = nextH;
                }
                if (
                    s.containerBorderInsetsPx.x !== border.x ||
                    s.containerBorderInsetsPx.y !== border.y
                ) {
                    s.containerBorderInsetsPx = border;
                }
            });
        };

        syncContentSize();
        if (typeof ResizeObserver === "undefined") return;

        const ro = new ResizeObserver(syncContentSize);
        const seen = new Set();
        const observe = (node) => {
            if (!node || seen.has(node)) return;
            seen.add(node);
            ro.observe(node);
        };
        observe(contentRef.current);

        return () => ro.disconnect();
    }, [hasExplicitContainerHeight, hasExplicitContainerWidth, setLocal]);

    useLayoutEffect(() => {
        if (hasHeightRefOrId) {
            const refEl = getRefElement(heightByRef);
            const idEl =
                typeof document !== "undefined" && heightById
                    ? document.getElementById(heightById)
                    : null;
            const source = refEl || idEl;

            const syncRefHeight = () => {
                const refHeight = getRefSize({ ref: source, axis: "y" });
                const ancestorHeight = refHeight
                    ? 0
                    : getAncestorAuthoredHeightWithoutSelf(containerRef.current);
                const parentHeight =
                    refHeight || ancestorHeight
                        ? 0
                        : getParentHeightWithoutSelf(containerRef.current);
                const nextHeight =
                    refHeight ||
                    (ancestorHeight > 0 ? `min(${ancestorHeight}px, 100vh)` : null) ||
                    (parentHeight > 0 ? `min(${parentHeight}px, 100vh)` : null) ||
                    "200px";

                setLocal((s) => {
                    if (s.hasMeasuredHeight && s.measuredHeight === nextHeight) return;
                    s.hasMeasuredHeight = true;
                    s.measuredHeight = nextHeight;
                    s.autoHeightCapsToParent = true;
                });
            };

            syncRefHeight();
            if (!source || typeof ResizeObserver === "undefined") return;
            const observer = new ResizeObserver(syncRefHeight);
            observer.observe(source);
            return () => observer.disconnect();
        }

        if (!autoHeightEnabled) return;

        const syncAutoHeight = () => {
            const container = containerRef.current;
            const content = contentRef.current;
            if (!container || !content) return;

            const barGutter = getBarAxisGutterPx(scrollBarExportedData, scrollBarProps);
            const reserveY = !!(scrollBarExportedData.top || scrollBarExportedData.bottom);
            const contentH = measureContentIntrinsicAxisPx(content, "y");
            const border = getContainerBorderInsetsPx(container);
            const shellPad = getPaddingInsetsFromElement(shellRef.current);
            const ancestorH = getAncestorAuthoredHeightWithoutSelf(container);
            const parentH =
                ancestorH > 0 ? ancestorH : getParentHeightWithoutSelf(container);

            const { px, capToParentPercent } = resolveAutoAxisPx({
                contentPx: contentH,
                parentPx: parentH,
                barGutterPx: barGutter,
                reserveBarGutter: reserveY,
                fallbackPx: 200,
                borderInsetPx: border.y + shellPad.y,
            });

            const nextHeight = `${px}px`;

            setLocal((s) => {
                if (
                    s.hasMeasuredHeight &&
                    s.measuredHeight === nextHeight &&
                    s.autoHeightCapsToParent === capToParentPercent
                ) {
                    return;
                }
                s.hasMeasuredHeight = true;
                s.measuredHeight = nextHeight;
                s.autoHeightCapsToParent = capToParentPercent;
            });
        };

        syncAutoHeight();
        if (typeof ResizeObserver === "undefined") return;

        const ro = new ResizeObserver(syncAutoHeight);
        const seen = new Set();
        const observe = (node) => {
            if (!node || seen.has(node)) return;
            seen.add(node);
            ro.observe(node);
        };
        observe(containerRef.current);
        observe(contentRef.current);
        observe(containerRef.current?.parentElement);

        return () => ro.disconnect();
    }, [
        autoHeightEnabled,
        hasHeightRefOrId,
        heightById,
        heightByRef,
        scrollBarExportedData,
        scrollBarProps,
        setLocal,
    ]);

    useLayoutEffect(() => {
        if (hasWidthRefOrId) {
            const refEl = getRefElement(widthByRef);
            const idEl =
                typeof document !== "undefined" && widthById
                    ? document.getElementById(widthById)
                    : null;
            const source = refEl || idEl;

            const syncRefWidth = () => {
                const nextWidth = getRefSize({ ref: source, axis: "x" });
                setLocal((s) => {
                    if (s.measuredWidth === nextWidth) return;
                    s.measuredWidth = nextWidth;
                    s.autoWidthCapsToParent = true;
                });
            };

            syncRefWidth();
            if (!source || typeof ResizeObserver === "undefined") return;
            const observer = new ResizeObserver(syncRefWidth);
            observer.observe(source);
            return () => observer.disconnect();
        }

        if (!autoWidthEnabled) return;

        const syncAutoWidth = () => {
            const container = containerRef.current;
            const content = contentRef.current;
            if (!container || !content) return;

            const barGutter = getBarAxisGutterPx(scrollBarExportedData, scrollBarProps);
            const reserveX = !!(scrollBarExportedData.left || scrollBarExportedData.right);
            const contentW = measureContentIntrinsicAxisPx(content, "x");
            const border = getContainerBorderInsetsPx(container);
            const shellPad = getPaddingInsetsFromElement(shellRef.current);
            const parentW = getParentWidthWithoutSelf(container);

            const { px, capToParentPercent } = resolveAutoAxisPx({
                contentPx: contentW,
                parentPx: parentW,
                barGutterPx: barGutter,
                reserveBarGutter: reserveX,
                fallbackPx: 200,
                borderInsetPx: border.x + shellPad.x,
            });

            const nextWidth = `${px}px`;

            setLocal((s) => {
                if (s.measuredWidth === nextWidth && s.autoWidthCapsToParent === capToParentPercent) {
                    return;
                }
                s.measuredWidth = nextWidth;
                s.autoWidthCapsToParent = capToParentPercent;
            });
        };

        syncAutoWidth();
        if (typeof ResizeObserver === "undefined") return;

        const ro = new ResizeObserver(syncAutoWidth);
        const seen = new Set();
        const observe = (node) => {
            if (!node || seen.has(node)) return;
            seen.add(node);
            ro.observe(node);
        };
        observe(containerRef.current);
        observe(contentRef.current);
        observe(containerRef.current?.parentElement);

        return () => ro.disconnect();
    }, [
        autoWidthEnabled,
        hasWidthRefOrId,
        scrollBarExportedData,
        scrollBarProps,
        setLocal,
        widthById,
        widthByRef,
    ]);

    const variantOuterStyle = useMemo(() => {
        const ew = getExplicitWidth({ width, flexProps, restProps: restPropsWithoutShellPadding });
        const eh = getExplicitHeight({ height, flexProps });
        const { gutterX, gutterY } = barGutters;
        const out = {};

        // —— Genişlik: container ——
        // Durum 1: sabit ölçü (200px, 100%, …) → container = ölçü; shell calc(100% - bar)
        if (hasExplicitContainerWidth) {
            const w = getLayoutSizeCss(ew);
            out.width = w;
            if (String(ew).trim() !== "100%") {
                out.maxWidth = w;
            }
        } else if (autoWidthEnabled && measuredWidth != null && measuredWidth !== "") {
            out.width = getLayoutSizeCss(measuredWidth);
            if (autoWidthCapsToParent) {
                out.maxWidth = "100%";
            }
        } else if (contentWidthPx > 0) {
            // Durum 2: container = içerik + bar + shell padding + border
            out.width = `${Math.round(contentWidthPx + getContainerExtraInsetPx("x"))}px`;
        } else if (intrinsicWidth) {
            out.width = "max-content";
        }

        if (maxWidth !== undefined && maxWidth !== null && maxWidth !== "" && !hasExplicitContainerWidth) {
            // Durum 3: max shell'de; container max = max + bar
            out.maxWidth = addBarGutterToCssSize(maxWidth, gutterX);
        } else if (maxWidth === null) {
            delete out.maxWidth;
        }

        // —— Yükseklik: container ——
        if (hasExplicitContainerHeight) {
            out.height = getLayoutSizeCss(eh);
        } else if (autoHeightEnabled && measuredHeight != null && measuredHeight !== "") {
            out.height = getLayoutSizeCss(measuredHeight);
            if (autoHeightCapsToParent) {
                out.maxHeight = "100%";
            }
        } else if (contentHeightPx > 0) {
            out.height = `${Math.round(contentHeightPx + getContainerExtraInsetPx("y"))}px`;
        }

        if (
            maxHeight !== undefined &&
            maxHeight !== null &&
            maxHeight !== "" &&
            !hasExplicitContainerHeight
        ) {
            out.maxHeight = addBarGutterToCssSize(maxHeight, gutterY);
        }

        if (needsShellViewport) {
            if (!out.display) out.display = "flex";
            if (!out.flexDirection) out.flexDirection = "column";
            if (out.minHeight === undefined || out.minHeight === null) out.minHeight = 0;
            if (out.minWidth === undefined || out.minWidth === null) out.minWidth = 0;
            if (!out.overflow) out.overflow = "hidden";
        }

        const merged = { ...out, ...(restPropsWithoutShellPadding.style || {}) };
        return Object.keys(merged).length ? merged : undefined;
    }, [
        autoHeightCapsToParent,
        autoHeightEnabled,
        autoWidthCapsToParent,
        autoWidthEnabled,
        barGutters,
        contentHeightPx,
        contentWidthPx,
        getContainerExtraInsetPx,
        flexProps,
        hasExplicitContainerHeight,
        hasExplicitContainerWidth,
        height,
        intrinsicWidth,
        maxHeight,
        maxWidth,
        measuredHeight,
        measuredWidth,
        needsShellViewport,
        restPropsWithoutShellPadding,
        width,
    ]);

    const endShellDrag = useCallback(() => {
        const el = contentRef.current;
        const pid = dragRef.current.pid;
        dragRef.current = { active: false, x0: 0, y0: 0, s0l: 0, s0t: 0, pid: null };
        setShellDragging(false);
        unlockShellTextSelection(el);
        if (el != null && pid != null) {
            try {
                el.releasePointerCapture(pid);
            } catch {
                /* ignore */
            }
        }
    }, []);

    useEffect(
        () => () => {
            endShellDrag();
        },
        [endShellDrag],
    );

    const shellPointerDown = useCallback(
        (e) => {
            if (!effectiveEnableDragging) return;
            if (e.pointerType === "mouse" && e.button !== 0) return;
            const el = shellRef.current;
            const surfaceEl = contentRef.current;
            if (!el || !surfaceEl || e.currentTarget !== surfaceEl) return;
            if (
                e.target !== surfaceEl &&
                e.target?.closest?.(
                    "a,button,input,textarea,select,label,[contenteditable=true],[role=button]",
                )
            ) {
                return;
            }
            dragRef.current = {
                active: true,
                x0: e.clientX,
                y0: e.clientY,
                s0l: el.scrollLeft,
                s0t: el.scrollTop,
                pid: e.pointerId,
            };
            if (e.cancelable) e.preventDefault();
            lockShellTextSelection(surfaceEl);
            setShellDragging(true);
            try {
                surfaceEl?.setPointerCapture(e.pointerId);
            } catch {
                /* ignore */
            }
        },
        [effectiveEnableDragging],
    );

    const shellPointerMove = useCallback((e) => {
        if (!dragRef.current.active) return;
        if (e.cancelable) e.preventDefault();
        const el = shellRef.current;
        if (!el) return;
        const d = dragRef.current;
        const next = computeDragScrollFromPointers(
            { x: d.x0, y: d.y0 },
            { x: e.clientX, y: e.clientY },
            { scrollLeft: d.s0l, scrollTop: d.s0t },
        );
        el.scrollLeft = next.scrollLeft;
        el.scrollTop = next.scrollTop;
    }, []);

    const shellPointerUp = useCallback(
        (e) => {
            if (!dragRef.current.active) return;
            if (e.type === "lostpointercapture" || e.type === "pointercancel") {
                endShellDrag();
                return;
            }
            if (dragRef.current.pid != null && e.pointerId !== dragRef.current.pid) return;
            endShellDrag();
        },
        [endShellDrag],
    );

    const shellSurfaceStyle = useMemo(() => {
        if (!effectiveEnableDragging) return undefined;
        return {
            cursor: shellDragging ? "grabbing" : "grab",
            touchAction: "none",
        };
    }, [effectiveEnableDragging, shellDragging]);

    const shellDragStartCapture = useCallback((e) => {
        if (!dragRef.current.active) return;
        e.preventDefault();
    }, []);

    const shellPointerHandlers = useMemo(() => {
        if (!effectiveEnableDragging) return {};
        return {
            onPointerDown: shellPointerDown,
            onPointerMove: shellPointerMove,
            onPointerUp: shellPointerUp,
            onPointerCancel: shellPointerUp,
            onLostPointerCapture: shellPointerUp,
            onDragStartCapture: shellDragStartCapture,
        };
    }, [
        effectiveEnableDragging,
        shellDragStartCapture,
        shellPointerDown,
        shellPointerMove,
        shellPointerUp,
    ]);

    /* Return */
    return useExportData(
        {
            exportData: scrollBoxExportData,
            Variant,
            flexProps: organizedFlexProps.flexProps,
            scrollBarProps: mergedScrollBarProps,
            theme,
            containerRef,
            shellRef,
            contentRef,
            shellPaddingStyle,
            shellSurfaceStyle,
            shellPointerHandlers,
            shouldRender: organizedFlexProps.shouldRender,
            shellLayoutStyle,
            shellViewportStyle,
            containerGridStyle,
            contentLayoutStyle,
            variantOuterStyle,
            ...restPropsWithoutShellPadding,
        },
        scrollBarExportedData,
    );
};
export default useVars;

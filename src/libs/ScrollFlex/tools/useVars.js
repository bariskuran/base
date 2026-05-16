import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { baseStore } from "../../@baseStore";
import { useExportData } from "../../useExportedData";
import { isShallowEqual } from "../../isShallowEqual";
import {
    mergeFlexKebabPropAliases,
    FLEX_PROPS_KEBAB_TO_CAMEL,
} from "../../Flex/tools/generateProps.js";
import { computeDragScrollFromPointers } from "./computeDragScrollDelta";

const EMPTY_FLEX_PROPS = {};
const EMPTY_SCROLL_BAR_PROPS = {};
const CONTENT_SIZE_MEASURE_SLACK_PX = 1;

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

const normalizeCalcValue = (value) =>
    typeof value === "string"
        ? value.replace(
              /calc\((.*)\)/g,
              (_, expression) => `calc(${expression.replace(/\s*([+\-*/])\s*/g, " $1 ")})`,
          )
        : value;

const getCssSize = (value) => {
    if (value == null) return "0";
    if (value === 0 || value === "0") return "0";
    if (typeof value === "number") return `${value}rem`;

    const v = String(value).trim().replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(v)) return `${v}rem`;

    return normalizeCalcValue(v);
};

const getLayoutSizeCss = (value) => {
    if (value == null || value === "") return undefined;

    if (typeof value === "string") {
        const v = value.trim();

        if (/^-?\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|dvw|dvh)$/i.test(v)) {
            return normalizeCalcValue(v);
        }

        if (/^(calc|min|max)\(/i.test(v)) {
            return normalizeCalcValue(v);
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

const getBarAxisGutterPx = (scrollBarData, scrollBarProps) => {
    const thickness = Number(scrollBarData?.thickness ?? scrollBarProps?.thickness ?? 4);
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

const getBarGutterInsets = (scrollBarData, scrollBarProps) => {
    const gutter = getBarAxisGutterPx(scrollBarData, scrollBarProps);

    return {
        gutterX: scrollBarData?.left || scrollBarData?.right ? gutter : 0,
        gutterY: scrollBarData?.top || scrollBarData?.bottom ? gutter : 0,
    };
};

const addBarGutterToCssSize = (size, gutterPx) => {
    if (size == null || size === "") return undefined;
    if (!gutterPx) return getLayoutSizeCss(size);

    return normalizeCalcValue(`calc(${getLayoutSizeCss(size)} + ${gutterPx}px)`);
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

const getPaddingInsetsFromElement = (el) => {
    if (!el || typeof getComputedStyle === "undefined") {
        return { x: 0, y: 0 };
    }

    const cs = getComputedStyle(el);

    return {
        x: Math.round((parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0)),
        y: Math.round((parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)),
    };
};

const getShellPaddingCssValue = (value) => {
    if (value == null) return null;
    if (value === 0 || value === "0") return "0";
    if (typeof value === "number") return `${value}rem`;

    const raw = String(value).trim();
    if (!raw) return null;

    const singleToken = raw.replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(singleToken)) return `${singleToken}rem`;

    return normalizeCalcValue(raw.replace(/\s+/g, " "));
};

const expandPaddingShorthandPx = (parts) => {
    if (!parts.length) return [0, 0, 0, 0];
    if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
    if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
    if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];

    return [parts[0], parts[1], parts[2], parts[3]];
};

const getShellPaddingInsetsPx = (shellPaddingStyle) => {
    if (!shellPaddingStyle || typeof shellPaddingStyle !== "object") {
        return { x: 0, y: 0 };
    }

    const p = shellPaddingStyle;

    let top = 0;
    let right = 0;
    let bottom = 0;
    let left = 0;

    if (p.padding != null) {
        const parts = String(p.padding).trim().split(/\s+/).map(parseCssLengthToPx);
        [top, right, bottom, left] = expandPaddingShorthandPx(parts);
    }

    if (p.paddingTop != null) top = parseCssLengthToPx(p.paddingTop);
    if (p.paddingRight != null) right = parseCssLengthToPx(p.paddingRight);
    if (p.paddingBottom != null) bottom = parseCssLengthToPx(p.paddingBottom);
    if (p.paddingLeft != null) left = parseCssLengthToPx(p.paddingLeft);

    if (p.paddingBlock != null) {
        const parts = String(p.paddingBlock).trim().split(/\s+/).map(parseCssLengthToPx);
        top = parts[0] ?? 0;
        bottom = parts[1] ?? parts[0] ?? 0;
    }

    if (p.paddingInline != null) {
        const parts = String(p.paddingInline).trim().split(/\s+/).map(parseCssLengthToPx);
        left = parts[0] ?? 0;
        right = parts[1] ?? parts[0] ?? 0;
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

const styleKeyToPaddingCamel = (key) => {
    if (typeof key !== "string") return null;
    if (PADDING_CAMEL_SET.has(key)) return key;
    if (!key.startsWith("padding")) return null;
    if (!key.includes("-")) return null;

    const camel = key.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());

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

const splitShellPaddingFromRestProps = (restProps) => {
    if (!restProps || typeof restProps !== "object") {
        return {
            shellPaddingStyle: {},
            restPropsWithoutShellPadding: {},
        };
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

        for (const key of Object.keys(nextStyle)) {
            const camel = styleKeyToPaddingCamel(key);

            if (camel == null) continue;

            const value = nextStyle[key];

            if (value != null && shellPaddingStyle[camel] == null) {
                const css = getShellPaddingCssValue(value);
                if (css != null) shellPaddingStyle = { ...shellPaddingStyle, [camel]: css };
            }

            delete nextStyle[key];
        }

        if (Object.keys(nextStyle).length) next.style = nextStyle;
        else delete next.style;
    }

    return {
        shellPaddingStyle: Object.keys(shellPaddingStyle).length ? shellPaddingStyle : {},
        restPropsWithoutShellPadding: next,
    };
};

const CONTENT_FLEX_PART_KEYS = [
    "flex",
    "flexGrow",
    "flexShrink",
    "flexBasis",
    "grow",
    "shrink",
    "basis",
    "flex-grow",
    "flex-shrink",
    "flex-basis",
];

const resolveContentFlexShorthand = (props) => {
    const merged = mergeFlexKebabPropAliases(props || {});

    const explicitFlex =
        merged.flex != null && String(merged.flex).trim() !== ""
            ? String(merged.flex).trim()
            : null;

    const growRaw = merged.flexGrow;
    const shrinkRaw = merged.flexShrink;
    const basisRaw = merged.flexBasis;

    const hasGrow = growRaw != null && growRaw !== "";
    const hasShrink = shrinkRaw != null && shrinkRaw !== "";
    const hasBasis = basisRaw != null && basisRaw !== "";
    const hasParts = hasGrow || hasShrink || hasBasis;

    if (explicitFlex) return explicitFlex;
    if (!hasParts) return null;

    const grow = hasGrow ? String(growRaw) : "0";
    const shrink = hasShrink ? String(shrinkRaw) : "0";
    const basis = hasBasis ? getLayoutSizeCss(basisRaw) ?? getCssSize(basisRaw) : "auto";

    return `${grow} ${shrink} ${basis}`;
};

const applyContentFlexProps = (props) => {
    if (!props || typeof props !== "object") return props;

    const shorthand = resolveContentFlexShorthand(props);
    const out = { ...props };

    for (const key of CONTENT_FLEX_PART_KEYS) {
        delete out[key];
    }

    if (shorthand == null) return out;

    const style = { ...(out.style || {}), flex: shorthand };

    return { ...out, flex: shorthand, style };
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

const getContainerHeight = ({ height }) => (height != null && height !== "" ? height : null);

const getContainerWidth = ({ width, restProps }) => {
    if (width != null && width !== "") return width;
    if (restProps?.width != null && restProps.width !== "") return restProps.width;

    return null;
};

const isFlexRowParent = (parent) => {
    if (!parent || typeof getComputedStyle === "undefined") return false;

    const cs = getComputedStyle(parent);

    if (!cs.display.includes("flex")) return false;

    const dir = cs.flexDirection;

    return dir === "row" || dir === "row-reverse";
};

const resolveContainerWidthSource = ({ width, restProps, measuredWidth, hasWidthRefOrId }) => {
    if (width != null && width !== "") return width;
    if (hasWidthRefOrId && measuredWidth != null && measuredWidth !== "") return measuredWidth;

    return getContainerWidth({ width, restProps });
};

const resolveContainerHeightSource = ({ height, measuredHeight, hasHeightRefOrId }) => {
    if (height != null && height !== "") return height;
    if (hasHeightRefOrId && measuredHeight != null && measuredHeight !== "") return measuredHeight;

    return getContainerHeight({ height });
};

const getRefElement = (ref) => ref?.current || ref || null;

const getRefSize = ({ ref, axis }) => {
    const el = getRefElement(ref);
    if (!el?.getBoundingClientRect) return null;

    const rect = el.getBoundingClientRect();
    const value = axis === "x" ? rect.width : rect.height;

    return value > 0 ? `${value}px` : null;
};

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
                if (node.matches(rule.selectorText)) return rule.style.height;
            } catch {
                continue;
            }
        }
    }

    return null;
};

const getAuthoredHeight = (node) => node?.style?.height || getRuleHeight(node);

const withNodeHidden = (node, fn) => {
    if (!node) return fn();

    const previousDisplay = node.style.display;
    node.style.display = "none";

    try {
        return fn();
    } finally {
        node.style.display = previousDisplay;
    }
};

const getParentHeightWithoutSelf = (node) => {
    const parent = node?.parentElement;
    if (!node || !parent) return 0;

    return withNodeHidden(node, () => parent.getBoundingClientRect().height);
};

const getParentWidthWithoutSelf = (node) => {
    const parent = node?.parentElement;
    if (!node || !parent) return 0;

    return withNodeHidden(node, () => parent.getBoundingClientRect().width);
};

const getAncestorAuthoredHeightWithoutSelf = (node) => {
    if (!node || typeof document === "undefined") return 0;

    return withNodeHidden(node, () => {
        let current = node.parentElement;

        while (current && current !== document.body && current !== document.documentElement) {
            if (isUsableHeightValue(getAuthoredHeight(current))) {
                return current.getBoundingClientRect().height;
            }

            current = current.parentElement;
        }

        return 0;
    });
};

const measureContentAxisPx = (el, axis) => {
    if (!el?.getBoundingClientRect) return 0;

    const rect = el.getBoundingClientRect();
    const roundAxis = axis === "x" ? Math.ceil : Math.round;
    const layout = roundAxis(axis === "x" ? rect.width || 0 : rect.height || 0);
    const scroll = roundAxis(axis === "x" ? el.scrollWidth || 0 : el.scrollHeight || 0);

    return Math.max(layout, scroll);
};

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
        return {
            px: fallbackPx,
            capToParentPercent: false,
        };
    }

    if (parent <= 0) {
        return {
            px: Math.round(content + gutter + border),
            capToParentPercent: false,
        };
    }

    return {
        px: Math.round(parent),
        capToParentPercent: true,
    };
};

const getTargetByRefOrId = ({ ref, id }) => {
    const refEl = getRefElement(ref);

    if (refEl) return refEl;

    if (typeof document !== "undefined" && typeof id === "string" && id.trim()) {
        return document.getElementById(id);
    }

    return null;
};

const createResizeObserver = (callback, nodes = []) => {
    if (typeof ResizeObserver === "undefined") return null;

    const ro = new ResizeObserver(callback);
    const seen = new Set();

    for (const node of nodes) {
        if (!node || seen.has(node)) continue;
        seen.add(node);
        ro.observe(node);
    }

    return ro;
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

    const explicitContainerWidthValue = getContainerWidth({
        width,
        restProps: restPropsWithoutShellPadding,
    });

    const hasWidthRefOrId =
        !!widthByRef || (typeof widthById === "string" && widthById.trim() !== "");

    const hasHeightRefOrId =
        !!heightByRef || (typeof heightById === "string" && heightById.trim() !== "");

    const intrinsicWidth =
        (explicitContainerWidthValue == null || explicitContainerWidthValue === "") &&
        !hasWidthRefOrId;

    const hasExplicitContainerHeight =
        (height != null && height !== "") || hasHeightRefOrId;

    const hasExplicitContainerWidth =
        (width != null && width !== "") || hasWidthRefOrId;

    const autoHeightEnabled = autoHeight !== false && !hasExplicitContainerHeight;
    const autoWidthEnabled = autoWidth !== false && !hasExplicitContainerWidth;

    const containerRef = useRef(null);
    const shellRef = useRef(null);
    const contentRef = useRef(null);
    const dragRef = useRef({
        active: false,
        x0: 0,
        y0: 0,
        s0l: 0,
        s0t: 0,
        pid: null,
    });

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
        autoWidthFlexGrow,
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
        autoWidthFlexGrow: false,
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
            sourceByRef: scrollBarProps.sourceByRef ?? shellRef,
            positionSourceByRef: scrollBarProps.positionSourceByRef ?? containerRef,
        }),
        [scrollBarProps, exportData],
    );

    const effectiveEnableDragging = enableDragging && !mergedScrollBarProps.fillMode;

    const barGutters = useMemo(
        () => getBarGutterInsets(scrollBarExportedData, scrollBarProps),
        [scrollBarExportedData, scrollBarProps],
    );

    const shellPaddingInsetsPx = useMemo(
        () => getShellPaddingInsetsPx(shellPaddingStyle),
        [shellPaddingStyle],
    );

    const hasMaxWidthBound = maxWidth !== undefined && maxWidth !== null && maxWidth !== "";
    const hasMaxHeightBound = maxHeight !== undefined && maxHeight !== null && maxHeight !== "";

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
        } else if (
            !autoWidthEnabled &&
            !hasExplicitContainerWidth &&
            contentWidthPx > 0
        ) {
            style.minWidth = `${contentWidthPx}px`;
        }

        if (!contentFillsShellHeight) {
            style.height = "max-content";
            style.maxHeight = "none";
        }

        return Object.keys(style).length ? style : undefined;
    }, [
        autoWidthEnabled,
        contentFillsShellHeight,
        contentFillsShellWidth,
        contentWidthPx,
        hasExplicitContainerWidth,
    ]);

    const getContainerExtraInsetPx = useCallback(
        (axis) => {
            const gutter = axis === "x" ? barGutters.gutterX : barGutters.gutterY;
            const pad = axis === "x" ? shellPaddingInsetsPx.x : shellPaddingInsetsPx.y;
            const border = axis === "x" ? containerBorderInsetsPx.x : containerBorderInsetsPx.y;
            return gutter + pad + border + CONTENT_SIZE_MEASURE_SLACK_PX;
        },
        [barGutters, containerBorderInsetsPx, shellPaddingInsetsPx],
    );

    const needsShellViewport = useMemo(
        () =>
            hasExplicitContainerWidth ||
            hasExplicitContainerHeight ||
            hasMaxWidthBound ||
            hasMaxHeightBound ||
            autoWidthEnabled ||
            autoHeightEnabled ||
            contentWidthPx > 0 ||
            contentHeightPx > 0,
        [
            autoHeightEnabled,
            autoWidthEnabled,
            contentHeightPx,
            contentWidthPx,
            hasExplicitContainerHeight,
            hasExplicitContainerWidth,
            hasMaxHeightBound,
            hasMaxWidthBound,
        ],
    );

    const shellViewportStyle = useMemo(() => {
        if (!needsShellViewport) return undefined;

        const style = {
            flex: "1 1 0",
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
        };

        if (hasMaxWidthBound && !hasExplicitContainerWidth) {
            style.maxWidth = getLayoutSizeCss(maxWidth);
        }

        if (hasMaxHeightBound && !hasExplicitContainerHeight) {
            style.maxHeight = getLayoutSizeCss(maxHeight);
        }

        return style;
    }, [
        hasExplicitContainerHeight,
        hasExplicitContainerWidth,
        hasMaxHeightBound,
        hasMaxWidthBound,
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

    const organizedFlexProps = useMemo(() => {
        const explicitContainerHeight = getContainerHeight({ height });
        const hasFlexContentHeight = flexProps.height != null && flexProps.height !== "";
        const hasFlexContentWidth = flexProps.width != null && flexProps.width !== "";

        const resolvedHeight = explicitContainerHeight ?? measuredHeight;

        const shouldRender =
            intrinsicWidth ||
            explicitContainerHeight != null ||
            measuredHeight != null ||
            !hasMeasuredHeight ||
            (hasMeasuredHeight &&
                explicitContainerHeight == null &&
                measuredHeight == null);

        const style = {
            ...(restPropsWithoutShellPadding.style || {}),
            ...(flexProps.style || {}),
            ...(explicitContainerHeight != null ? { maxHeight: "100vh" } : {}),
        };

        if (
            explicitContainerWidthValue != null &&
            !hasFlexContentWidth &&
            style.width == null
        ) {
            style.width = getLayoutSizeCss(explicitContainerWidthValue);
        }

        const mergedFlexProps = {
            ...restPropsWithoutShellPadding,
            ...flexProps,
            ...(shouldRender &&
            resolvedHeight != null &&
            resolvedHeight !== "" &&
            !hasFlexContentHeight
                ? { height: resolvedHeight }
                : {}),
            style,
        };

        const alignedFlexProps = mergeDefaultAlignment(mergedFlexProps);

        const shellHeightBounded =
            hasExplicitContainerHeight ||
            hasMaxHeightBound ||
            (autoHeightEnabled && measuredHeight != null && measuredHeight !== "");

        const hasBoundedScrollHeight = shouldRender && shellHeightBounded;

        if (!hasBoundedScrollHeight || hasFlexContentHeight) {
            return {
                shouldRender,
                flexProps: applyContentFlexProps(alignedFlexProps),
            };
        }

        const {
            height: _height,
            maxHeight: _maxHeight,
            style: alignedStyle,
            ...restAligned
        } = alignedFlexProps;

        const nextStyle = { ...(alignedStyle || {}) };

        delete nextStyle.height;
        delete nextStyle.maxHeight;

        if (nextStyle.minHeight == null && nextStyle.minBlockSize == null) {
            nextStyle.minHeight = "100%";
        }

        return {
            shouldRender,
            flexProps: applyContentFlexProps({
                ...restAligned,
                style: nextStyle,
            }),
        };
    }, [
        autoHeightEnabled,
        explicitContainerWidthValue,
        flexProps,
        hasExplicitContainerHeight,
        hasMaxHeightBound,
        hasMeasuredHeight,
        height,
        intrinsicWidth,
        measuredHeight,
        restPropsWithoutShellPadding,
        width,
    ]);

    useLayoutEffect(() => {
        if (hasExplicitContainerWidth && hasExplicitContainerHeight) return;

        const syncContentSize = () => {
            const content = contentRef.current;
            const container = containerRef.current;

            if (!content) return;

            const border = container ? getContainerBorderInsetsPx(container) : { x: 0, y: 0 };
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

        const ro = createResizeObserver(syncContentSize, [
            contentRef.current,
            containerRef.current,
            shellRef.current,
        ]);

        return () => ro?.disconnect();
    }, [
        barGutters.gutterX,
        barGutters.gutterY,
        hasExplicitContainerHeight,
        hasExplicitContainerWidth,
        scrollBarExportedData.left,
        scrollBarExportedData.right,
        scrollBarExportedData.top,
        scrollBarExportedData.bottom,
        setLocal,
    ]);

    useLayoutEffect(() => {
        if (hasHeightRefOrId) {
            const source = getTargetByRefOrId({
                ref: heightByRef,
                id: heightById,
            });

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

            const ro = createResizeObserver(syncRefHeight, [source]);

            return () => ro?.disconnect();
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
            const parentH = ancestorH > 0 ? ancestorH : getParentHeightWithoutSelf(container);

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

        const ro = createResizeObserver(syncAutoHeight, [
            containerRef.current,
            contentRef.current,
            containerRef.current?.parentElement,
        ]);

        return () => ro?.disconnect();
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
            const source = getTargetByRefOrId({
                ref: widthByRef,
                id: widthById,
            });

            const syncRefWidth = () => {
                const nextWidth = getRefSize({ ref: source, axis: "x" });

                setLocal((s) => {
                    if (s.measuredWidth === nextWidth) return;

                    s.measuredWidth = nextWidth;
                    s.autoWidthCapsToParent = true;
                });
            };

            syncRefWidth();

            const ro = createResizeObserver(syncRefWidth, [source]);

            return () => ro?.disconnect();
        }

        if (!autoWidthEnabled) return;

        const syncAutoWidth = () => {
            const container = containerRef.current;
            const content = contentRef.current;

            if (!container || !content) return;

            const parent = container.parentElement;
            const useFlexGrow = isFlexRowParent(parent);

            if (useFlexGrow) {
                setLocal((s) => {
                    if (s.autoWidthFlexGrow && s.measuredWidth == null) return;

                    s.autoWidthFlexGrow = true;
                    s.measuredWidth = null;
                    s.autoWidthCapsToParent = true;
                });

                return;
            }

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
                if (
                    s.autoWidthFlexGrow === false &&
                    s.measuredWidth === nextWidth &&
                    s.autoWidthCapsToParent === capToParentPercent
                ) {
                    return;
                }

                s.autoWidthFlexGrow = false;
                s.measuredWidth = nextWidth;
                s.autoWidthCapsToParent = capToParentPercent;
            });
        };

        syncAutoWidth();

        const ro = createResizeObserver(syncAutoWidth, [
            containerRef.current,
            contentRef.current,
            containerRef.current?.parentElement,
        ]);

        return () => ro?.disconnect();
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
        const containerWidthSource = resolveContainerWidthSource({
            width,
            restProps: restPropsWithoutShellPadding,
            measuredWidth,
            hasWidthRefOrId,
        });

        const containerHeightSource = resolveContainerHeightSource({
            height,
            measuredHeight,
            hasHeightRefOrId,
        });

        const { gutterX, gutterY } = barGutters;
        const out = {};

        if (
            hasExplicitContainerWidth &&
            containerWidthSource != null &&
            containerWidthSource !== ""
        ) {
            const w = getLayoutSizeCss(containerWidthSource);

            out.width = w;

            if (String(containerWidthSource).trim() !== "100%") {
                out.maxWidth = w;
            }
        } else if (autoWidthEnabled && autoWidthFlexGrow) {
            out.flex = "1 1 0";
            out.minWidth = 0;
        } else if (autoWidthEnabled && measuredWidth != null && measuredWidth !== "") {
            out.width = getLayoutSizeCss(measuredWidth);

            if (autoWidthCapsToParent) {
                out.maxWidth = "100%";
            }
        } else if (contentWidthPx > 0) {
            out.width = `${Math.ceil(contentWidthPx + getContainerExtraInsetPx("x"))}px`;
        } else if (intrinsicWidth) {
            out.width = "max-content";
        }

        if (hasMaxWidthBound && !hasExplicitContainerWidth) {
            out.maxWidth = addBarGutterToCssSize(maxWidth, gutterX);
        } else if (maxWidth === null) {
            delete out.maxWidth;
        }

        if (
            hasExplicitContainerHeight &&
            containerHeightSource != null &&
            containerHeightSource !== ""
        ) {
            out.height = getLayoutSizeCss(containerHeightSource);
        } else if (autoHeightEnabled && measuredHeight != null && measuredHeight !== "") {
            out.height = getLayoutSizeCss(measuredHeight);

            if (autoHeightCapsToParent) {
                out.maxHeight = "100%";
            }
        } else if (contentHeightPx > 0) {
            out.height = `${Math.round(contentHeightPx + getContainerExtraInsetPx("y"))}px`;
        }

        if (hasMaxHeightBound && !hasExplicitContainerHeight) {
            out.maxHeight = addBarGutterToCssSize(maxHeight, gutterY);
        }

        if (needsShellViewport) {
            out.display ??= "flex";
            out.flexDirection ??= "column";
            out.minHeight ??= 0;
            out.minWidth ??= 0;
            out.overflow ??= "hidden";
        }

        const merged = {
            ...out,
            ...(restPropsWithoutShellPadding.style || {}),
        };

        return Object.keys(merged).length ? merged : undefined;
    }, [
        autoHeightCapsToParent,
        autoHeightEnabled,
        autoWidthCapsToParent,
        autoWidthEnabled,
        autoWidthFlexGrow,
        barGutters,
        contentHeightPx,
        contentWidthPx,
        flexProps,
        getContainerExtraInsetPx,
        hasExplicitContainerHeight,
        hasExplicitContainerWidth,
        hasHeightRefOrId,
        hasMaxHeightBound,
        hasMaxWidthBound,
        hasWidthRefOrId,
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

        dragRef.current = {
            active: false,
            x0: 0,
            y0: 0,
            s0l: 0,
            s0t: 0,
            pid: null,
        };

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

    useEffect(() => () => endShellDrag(), [endShellDrag]);

    const shellPointerDown = useCallback(
        (e) => {
            if (!effectiveEnableDragging) return;
            if (e.pointerType === "mouse" && e.button !== 0) return;

            const el = shellRef.current;
            const surfaceEl = contentRef.current;

            if (!el || !surfaceEl || e.currentTarget !== surfaceEl) return;

            const interactiveSelector =
                "a,button,input,textarea,select,label,[contenteditable=true],[role=button]";

            if (e.target !== surfaceEl && e.target?.closest?.(interactiveSelector)) {
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
                surfaceEl.setPointerCapture(e.pointerId);
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

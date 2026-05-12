import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { baseStore } from "../../@baseStore";
import { useExportData } from "../../useExportedData";
import { isShallowEqual } from "../../isShallowEqual";

const EMPTY_FLEX_PROPS = {};
const EMPTY_SCROLL_BAR_PROPS = {};

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

const normalizeCalcValue = (value) =>
    typeof value === "string"
        ? value.replace(
              /calc\((.*)\)/g,
              (_, expression) => `calc(${expression.replace(/\s*([+\-*/])\s*/g, " $1 ")})`,
          )
        : value;

const getScrollBarSpace = ({ edgeMargin, thickness } = {}) => {
    if (edgeMargin == null || thickness == null) return null;
    return `${edgeMargin}px + ${thickness}rem`;
};

const resolveContentPaddingStyle = (props = {}) => {
    const {
        padding,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    } = props;

    const hasUserPadding =
        padding != null ||
        paddingTop != null ||
        paddingRight != null ||
        paddingBottom != null ||
        paddingLeft != null;

    const basePadding = hasUserPadding ? padding : 10;

    return {
        padding: getCssSize(basePadding),
        ...(paddingTop != null ? { paddingTop: getCssSize(paddingTop) } : {}),
        ...(paddingRight != null ? { paddingRight: getCssSize(paddingRight) } : {}),
        ...(paddingBottom != null ? { paddingBottom: getCssSize(paddingBottom) } : {}),
        ...(paddingLeft != null ? { paddingLeft: getCssSize(paddingLeft) } : {}),
    };
};

const getShellGutters = (scrollBarData) => {
    const s = getScrollBarSpace(scrollBarData);
    const edge = (key) => {
        if (!s || !scrollBarData?.[key]) return "0px";
        return `calc(${s})`;
    };

    return {
        gutterTop: edge("top"),
        gutterRight: edge("right"),
        gutterBottom: edge("bottom"),
        gutterLeft: edge("left"),
    };
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
        scrollBarProps = EMPTY_SCROLL_BAR_PROPS,
        exportData: scrollBoxExportData,
        __hasParentUiComponent,
        ...restProps
    } = p || {};

    const explicitWidthValue = getExplicitWidth({ width, flexProps, restProps });
    const explicitHeightValue = getExplicitHeight({ height, flexProps });
    const hasWidthRefOrId =
        !!widthByRef || (typeof widthById === "string" && widthById.trim() !== "");
    const hasHeightRefOrId =
        !!heightByRef || (typeof heightById === "string" && heightById.trim() !== "");
    const intrinsicWidth =
        (explicitWidthValue == null || explicitWidthValue === "") && !hasWidthRefOrId;
    const intrinsicHeight =
        (explicitHeightValue == null || explicitHeightValue === "") && !hasHeightRefOrId;

    const containerRef = useRef(null);
    const [theme] = baseStore.useGlobal((s) => [s.theme]);
    const { measuredWidth, measuredHeight, hasMeasuredHeight, scrollBarExportedData, setLocal } =
        baseStore.useLocal({
        measuredWidth: null,
        measuredHeight: null,
        hasMeasuredHeight: false,
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

    const organizedFlexProps = useMemo(() => {
        const explicitHeight = getExplicitHeight({
            height,
            flexProps,
        });
        const explicitWidth = getExplicitWidth({
            width,
            flexProps,
            restProps,
        });
        const resolvedHeight = intrinsicHeight ? undefined : explicitHeight ?? measuredHeight;
        const resolvedWidth = intrinsicWidth ? undefined : explicitWidth ?? measuredWidth;

        const shouldRender =
            intrinsicWidth ||
            intrinsicHeight ||
            explicitHeight != null ||
            measuredHeight != null ||
            !hasMeasuredHeight ||
            (hasMeasuredHeight && explicitHeight == null && measuredHeight == null);

        const style = {
            ...(restProps.style || {}),
            ...(flexProps.style || {}),
            ...(explicitHeight != null ? { maxHeight: "100vh" } : {}),
        };

        if (explicitWidth != null && style.width == null) {
            style.width = getCssSize(explicitWidth);
        }

        const mergedFlexProps = {
            ...restProps,
            ...flexProps,
            ...(resolvedWidth != null && resolvedWidth !== ""
                ? { width: resolvedWidth }
                : {}),
            ...(shouldRender && resolvedHeight != null && resolvedHeight !== ""
                ? { height: resolvedHeight }
                : {}),
            style,
        };

        const contentPaddingStyle = resolveContentPaddingStyle(mergedFlexProps);
        const {
            padding: _padding,
            paddingTop: _paddingTop,
            paddingRight: _paddingRight,
            paddingBottom: _paddingBottom,
            paddingLeft: _paddingLeft,
            ...flexPropsWithoutPadding
        } = mergedFlexProps;

        const alignedFlexProps = mergeDefaultAlignment(flexPropsWithoutPadding);

        /* Outer Variant already gets `height`; the same value on the inner Flex caps the
         * border-box and lets overflowing children paint over the bottom padding. Inner
         * should grow with content + padding; `min-height: 100%` keeps short lists filling
         * the shell when the outer height is definite. */
        const hasBoundedScrollHeight =
            shouldRender && resolvedHeight != null && resolvedHeight !== "";

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
            contentPaddingStyle,
        };
    }, [
        flexProps,
        hasMeasuredHeight,
        height,
        intrinsicHeight,
        intrinsicWidth,
        measuredHeight,
        measuredWidth,
        restProps,
        width,
    ]);

    const shellGutters = useMemo(
        () => getShellGutters(scrollBarExportedData),
        [scrollBarExportedData],
    );

    useLayoutEffect(() => {
        if (intrinsicHeight) return;
        if (getExplicitHeight({ height, flexProps }) != null) return;
        const refEl = getRefElement(heightByRef);
        const idEl =
            typeof document !== "undefined" && heightById
                ? document.getElementById(heightById)
                : null;
        const source = refEl || idEl;

        const syncHeight = () => {
            const refHeight = getRefSize({
                ref: source,
                axis: "y",
            });
            const ancestorHeight = refHeight
                ? 0
                : getAncestorAuthoredHeightWithoutSelf(containerRef.current);
            const parentHeight =
                refHeight || ancestorHeight ? 0 : getParentHeightWithoutSelf(containerRef.current);
            const nextHeight =
                refHeight ||
                (ancestorHeight > 0 ? `min(${ancestorHeight}px, 100vh)` : null) ||
                (parentHeight > 0 ? `min(${parentHeight}px, 100vh)` : null);

            setLocal((s) => {
                if (s.hasMeasuredHeight && s.measuredHeight === nextHeight) return;
                s.hasMeasuredHeight = true;
                s.measuredHeight = nextHeight;
            });
        };

        syncHeight();

        if (!source || typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(syncHeight);
        observer.observe(source);

        return () => {
            observer.disconnect();
        };
    }, [flexProps, height, heightById, heightByRef, intrinsicHeight, setLocal]);

    useLayoutEffect(() => {
        if (intrinsicWidth) return;
        if (getExplicitWidth({ width, flexProps, restProps }) != null) return;
        const refEl = getRefElement(widthByRef);
        const idEl =
            typeof document !== "undefined" && widthById ? document.getElementById(widthById) : null;
        const source = refEl || idEl;

        const syncWidth = () => {
            const nextWidth = getRefSize({
                ref: source,
                axis: "x",
            });

            setLocal((s) => {
                if (s.measuredWidth === nextWidth) return;
                s.measuredWidth = nextWidth;
            });
        };

        syncWidth();

        if (!source || typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(syncWidth);
        observer.observe(source);

        return () => {
            observer.disconnect();
        };
    }, [flexProps, intrinsicWidth, restProps, setLocal, width, widthById, widthByRef]);

    const variantOuterStyle = useMemo(() => {
        const ew = getExplicitWidth({ width, flexProps, restProps });
        const eh = getExplicitHeight({ height, flexProps });
        const out = {};
        if (ew != null && ew !== "") {
            const w = getCssSize(ew);
            out.width = w;
            out.maxWidth = w;
        }
        if (eh != null && eh !== "") {
            out.height = getCssSize(eh);
        }

        if (intrinsicWidth) {
            out.width = "max-content";
            if (maxWidth === null) {
                delete out.maxWidth;
            } else if (maxWidth !== undefined && maxWidth !== "") {
                out.maxWidth = getCssSize(maxWidth);
            } else {
                out.maxWidth = getCssSize("30vw");
            }
        } else if (maxWidth !== undefined && maxWidth !== null && maxWidth !== "") {
            out.maxWidth = getCssSize(maxWidth);
        }

        if (intrinsicHeight) {
            out.height = "max-content";
            if (maxHeight === null) {
                delete out.maxHeight;
            } else if (maxHeight !== undefined && maxHeight !== "") {
                out.maxHeight = getCssSize(maxHeight);
            } else {
                out.maxHeight = getCssSize("30vh");
            }
        } else if (maxHeight !== undefined && maxHeight !== null && maxHeight !== "") {
            out.maxHeight = getCssSize(maxHeight);
        }

        if (
            (out.maxHeight != null && out.maxHeight !== "") ||
            (out.maxWidth != null && out.maxWidth !== "")
        ) {
            if (!out.display) out.display = "flex";
            if (!out.flexDirection) out.flexDirection = "column";
            if (out.minHeight === undefined || out.minHeight === null) out.minHeight = 0;
            if (out.minWidth === undefined || out.minWidth === null) out.minWidth = 0;
            if (!out.overflow) out.overflow = "hidden";
        }

        const merged = { ...out, ...(restProps.style || {}) };
        return Object.keys(merged).length ? merged : undefined;
    }, [
        flexProps,
        height,
        intrinsicHeight,
        intrinsicWidth,
        maxHeight,
        maxWidth,
        restProps,
        width,
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
            shouldRender: organizedFlexProps.shouldRender,
            contentPaddingStyle: organizedFlexProps.contentPaddingStyle,
            variantOuterStyle,
            intrinsicHeight,
            ...restProps,
            shellGutters,
        },
        scrollBarExportedData,
    );
};
export default useVars;

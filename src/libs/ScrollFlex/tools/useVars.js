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
const getEdgeToMargin = (scrollBarData, scrollBarProps) => {
    const value = scrollBarData?.edgeMargin ?? scrollBarProps?.edgeMargin ?? -5;
    const numeric = Number(value);

    return Number.isFinite(numeric) ? Math.abs(numeric) : 5;
};

const getShellLayoutStyle = (scrollBarData, scrollBarProps) => {
    const edgeToMargin = getEdgeToMargin(scrollBarData, scrollBarProps);
    const barSpace = edgeToMargin + 4;

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

    const containerRef = useRef(null);
    const shellRef = useRef(null);
    const contentRef = useRef(null);
    const dragRef = useRef({ active: false, x0: 0, y0: 0, s0l: 0, s0t: 0, pid: null });
    const [shellDragging, setShellDragging] = useState(false);
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
        const resolvedWidth = intrinsicWidth ? undefined : (explicitWidth ?? measuredWidth);

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
            ...(resolvedWidth != null && resolvedWidth !== "" ? { width: resolvedWidth } : {}),
            ...(shouldRender && resolvedHeight != null && resolvedHeight !== ""
                ? { height: resolvedHeight }
                : {}),
            style,
        };

        const alignedFlexProps = mergeDefaultAlignment(mergedFlexProps);

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
        };
    }, [
        flexProps,
        hasMeasuredHeight,
        height,
        intrinsicWidth,
        measuredHeight,
        measuredWidth,
        restPropsWithoutShellPadding,
        width,
    ]);

    const shellLayoutStyle = useMemo(
        () => getShellLayoutStyle(scrollBarExportedData, scrollBarProps),
        [scrollBarExportedData, scrollBarProps],
    );

    useLayoutEffect(() => {
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
                (parentHeight > 0 ? `min(${parentHeight}px, 100vh)` : null) ||
                "200px";

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
    }, [flexProps, height, heightById, heightByRef, setLocal]);

    useLayoutEffect(() => {
        if (intrinsicWidth) return;
        if (getExplicitWidth({ width, flexProps, restProps }) != null) return;
        const refEl = getRefElement(widthByRef);
        const idEl =
            typeof document !== "undefined" && widthById
                ? document.getElementById(widthById)
                : null;
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
    }, [flexProps, intrinsicWidth, restPropsWithoutShellPadding, setLocal, width, widthById, widthByRef]);

    const variantOuterStyle = useMemo(() => {
        const ew = getExplicitWidth({ width, flexProps, restProps: restPropsWithoutShellPadding });
        const eh = getExplicitHeight({ height, flexProps });
        const out = {};
        if (ew != null && ew !== "") {
            const w = getCssSize(ew);
            out.width = w;
            out.maxWidth = w;
        } else if (!intrinsicWidth && measuredWidth != null && measuredWidth !== "") {
            const w = getCssSize(measuredWidth);
            out.width = w;
            out.maxWidth = w;
        }
        if (eh != null && eh !== "") {
            out.height = getCssSize(eh);
        } else if (measuredHeight != null && measuredHeight !== "") {
            out.height = getCssSize(measuredHeight);
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

        if (maxHeight !== undefined && maxHeight !== null && maxHeight !== "") {
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

        const merged = { ...out, ...(restPropsWithoutShellPadding.style || {}) };
        return Object.keys(merged).length ? merged : undefined;
    }, [
        flexProps,
        height,
        intrinsicWidth,
        maxHeight,
        maxWidth,
        measuredHeight,
        measuredWidth,
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
            variantOuterStyle,
            ...restPropsWithoutShellPadding,
        },
        scrollBarExportedData,
    );
};
export default useVars;

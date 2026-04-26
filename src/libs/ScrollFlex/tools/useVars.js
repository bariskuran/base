import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { baseStore } from "../../@baseStore";
import { useExportData } from "../../useExportedData";
import { shallowEqual } from "../../shallowEqual";

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

const unwrapCalc = (value) => {
    const v = getCssSize(value);
    const match = typeof v === "string" ? v.match(/^calc\((.*)\)$/) : null;
    return match ? match[1] : v;
};

const splitCssQuad = (value) => {
    if (value == null) return [undefined, undefined, undefined, undefined];
    if (typeof value === "number") return [value, value, value, value];

    const parts = String(value).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return [undefined, undefined, undefined, undefined];
    if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
    if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
    if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
    return [parts[0], parts[1], parts[2], parts[3]];
};

const addCssValues = (base, extra) => {
    if (!extra) return base;
    if (base == null) return extra;
    return `calc(${unwrapCalc(base)} + ${unwrapCalc(extra)})`;
};

const getScrollBarSpace = ({ edgeMargin, thickness } = {}) => {
    if (edgeMargin == null || thickness == null) return null;
    return `${edgeMargin * 2}px + ${thickness}rem`;
};

const mergePadding = (props, scrollBarData) => {
    const hasVisibleBar =
        scrollBarData?.top || scrollBarData?.right || scrollBarData?.bottom || scrollBarData?.left;
    const hasUserPadding =
        props.padding != null ||
        props.paddingTop != null ||
        props.paddingRight != null ||
        props.paddingBottom != null ||
        props.paddingLeft != null;

    if (!hasVisibleBar && hasUserPadding) return props;

    const scrollBarSpace = getScrollBarSpace(scrollBarData);
    if (hasVisibleBar && !scrollBarSpace) return props;

    const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...rest } = props;
    const [top, right, bottom, left] = splitCssQuad(hasUserPadding ? padding : 10);

    return {
        ...rest,
        padding: [
            addCssValues(paddingTop ?? top, scrollBarData.top ? scrollBarSpace : null),
            addCssValues(paddingRight ?? right, scrollBarData.right ? scrollBarSpace : null),
            addCssValues(paddingBottom ?? bottom, scrollBarData.bottom ? scrollBarSpace : null),
            addCssValues(paddingLeft ?? left, scrollBarData.left ? scrollBarSpace : null),
        ]
            .map((item) => getCssSize(item))
            .join(" "),
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
        widthByRef,
        heightByRef,
        widthById,
        heightById,
        scrollBarProps = EMPTY_SCROLL_BAR_PROPS,
        exportData: scrollBoxExportData,
        __hasParentUiComponent,
        ...restProps
    } = p || {};

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
                if (shallowEqual(s.scrollBarExportedData, nextLayoutData)) return;
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
        const shouldRender = explicitHeight != null || measuredHeight != null || !hasMeasuredHeight;
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
            width: explicitWidth ?? measuredWidth ?? "100%",
            ...(shouldRender ? { height: explicitHeight ?? measuredHeight } : {}),
            style,
        };

        return {
            shouldRender,
            flexProps: mergeDefaultAlignment(mergePadding(mergedFlexProps, scrollBarExportedData)),
        };
    }, [
        flexProps,
        hasMeasuredHeight,
        height,
        measuredHeight,
        measuredWidth,
        restProps,
        scrollBarExportedData,
        width,
    ]);

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
    }, [flexProps, height, heightById, heightByRef, setLocal]);

    useLayoutEffect(() => {
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
    }, [flexProps, restProps, setLocal, width, widthById, widthByRef]);
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
            ...restProps,
        },
        scrollBarExportedData,
    );
};
export default useVars;

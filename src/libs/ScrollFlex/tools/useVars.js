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

const getParentHeightWithoutSelf = (node) => {
    const parent = node?.parentElement;
    if (!node || !parent) return 0;

    const previousDisplay = node.style.display;
    node.style.display = "none";
    const parentHeight = parent.getBoundingClientRect().height;
    node.style.display = previousDisplay;

    return parentHeight;
};

const useVars = (p) => {
    const {
        Variant,
        flexProps = EMPTY_FLEX_PROPS,
        width,
        height,
        scrollBarProps = EMPTY_SCROLL_BAR_PROPS,
        exportData: scrollBoxExportData,
        __hasParentUiComponent,
        ...restProps
    } = p || {};

    const containerRef = useRef(null);
    const [theme] = baseStore.useGlobal((s) => [s.theme]);
    const { measuredHeight, scrollBarExportedData, setLocal } = baseStore.useLocal({
        measuredHeight: null,
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
        const explicitWidth = width ?? flexProps.width ?? restProps.width;
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
            width: explicitWidth ?? "100%",
            height: explicitHeight ?? measuredHeight ?? 0,
            style,
        };

        return mergeDefaultAlignment(mergePadding(mergedFlexProps, scrollBarExportedData));
    }, [flexProps, height, measuredHeight, restProps, scrollBarExportedData, width]);

    useLayoutEffect(() => {
        if (getExplicitHeight({ height, flexProps }) != null) return;

        const parentHeight = getParentHeightWithoutSelf(containerRef.current);
        const nextHeight = parentHeight > 0 ? `min(${parentHeight}px, 100vh)` : 200;

        setLocal((s) => {
            if (s.measuredHeight === nextHeight) return;
            s.measuredHeight = nextHeight;
        });
    }, [flexProps, height, setLocal]);
    /* Return */
    return useExportData(
        {
            exportData: scrollBoxExportData,
            Variant,
            flexProps: organizedFlexProps,
            scrollBarProps: mergedScrollBarProps,
            theme,
            containerRef,
            ...restProps,
        },
        scrollBarExportedData,
    );
};
export default useVars;

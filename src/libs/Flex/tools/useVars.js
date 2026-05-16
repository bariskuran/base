import {
    Children,
    Fragment,
    cloneElement,
    isValidElement,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { baseStore } from "../../@baseStore";
import { useExportData } from "../../useExportedData";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { deepMerge } from "../../deepMerge";
import {
    generateProps,
    mergeCommonAndItem,
    mergeFlexKebabPropAliases,
    normalizeFlexPropsWithResponsiveAliases,
} from "./generateProps.js";
import { getFlexDomRestProps } from "./getFlexDomRestProps.js";
import { sysDefaults } from "./sysDefaults.js";
import { splitUserStyle, SHELL_SURFACE_PROP_KEYS } from "./splitUserStyle.js";
import { mergeStyles } from "./mergeStyles.js";
import { resolveFlexTypoWrap } from "./resolveFlexTypoWrap.js";

const FULL_WIDTH_FLEX_IN_FLEX_PARENT = "1 1 100%";

const isFlexDisplayValue = (display) => display === "flex" || display === "inline-flex";

const readParentIsFlexContainer = (node) => {
    const parent = node?.parentElement;
    if (!parent || typeof getComputedStyle === "undefined") return false;
    return isFlexDisplayValue(getComputedStyle(parent).display);
};

export const useVars = ({ props, children, content, className, style, forwardedRef }) => {
    const [currentBreakpoint] = baseStore.useGlobal((s) => [s._clientData.currentBreakpoint]);
    const rootRef = useRef(null);

    const propsNorm = useMemo(() => normalizeFlexPropsWithResponsiveAliases(props), [props]);

    const mergedBreakpointRow = useMemo(() => {
        const merged1 = deepMerge(sysDefaults, propsNorm);
        const bpOverride = propsNorm?.responsive?.[currentBreakpoint] || {};
        return mergeFlexKebabPropAliases(deepMerge(merged1, bpOverride));
    }, [propsNorm, currentBreakpoint]);

    const bpOverrideRow = propsNorm?.responsive?.[currentBreakpoint] || {};

    const hasUserFlexControl = useMemo(
        () =>
            propsNorm?.flex != null ||
            bpOverrideRow?.flex != null ||
            propsNorm?.flexGrow != null ||
            bpOverrideRow?.flexGrow != null ||
            propsNorm?.grow != null ||
            bpOverrideRow?.grow != null ||
            propsNorm?.flexShrink != null ||
            bpOverrideRow?.flexShrink != null ||
            propsNorm?.shrink != null ||
            bpOverrideRow?.shrink != null ||
            propsNorm?.flexBasis != null ||
            bpOverrideRow?.flexBasis != null ||
            propsNorm?.basis != null ||
            bpOverrideRow?.basis != null,
        [bpOverrideRow, propsNorm],
    );

    const isFullShorthand = useMemo(
        () =>
            (propsNorm?.full === true || bpOverrideRow?.full === true) &&
            propsNorm?.width == null &&
            bpOverrideRow?.width == null &&
            !hasUserFlexControl,
        [bpOverrideRow, hasUserFlexControl, propsNorm],
    );

    const [parentIsFlex, setParentIsFlex] = useState(false);

    const syncParentIsFlex = useCallback(() => {
        const el = rootRef.current;
        setParentIsFlex(Boolean(el && isFullShorthand && readParentIsFlexContainer(el)));
    }, [isFullShorthand]);

    useLayoutEffect(() => {
        syncParentIsFlex();
        const el = rootRef.current;
        if (!el || !isFullShorthand) return;

        const parent = el.parentElement;
        if (!parent || typeof ResizeObserver === "undefined") return;

        const ro = new ResizeObserver(syncParentIsFlex);
        ro.observe(parent);
        return () => ro.disconnect();
    }, [isFullShorthand, syncParentIsFlex, mergedBreakpointRow, children, content]);

    const childrenCount = Children.count(children ?? content);

    const { containerStyle: userContainerStyle, contentStyle: userContentStyle } = useMemo(
        () => splitUserStyle(style),
        [style],
    );

    const userRootStyle = useMemo(
        () => mergeStyles(userContainerStyle, userContentStyle),
        [userContainerStyle, userContentStyle],
    );

    const generatedProps = useMemo(
        () =>
            generateProps({
                props,
                currentBreakpoint,
                sysDefaults,
                childrenCount,
            }),
        [props, currentBreakpoint, childrenCount],
    );

    const typographyWrap = useMemo(() => {
        const raw = mergedBreakpointRow.typography ?? mergedBreakpointRow.typo;
        return resolveFlexTypoWrap(raw);
    }, [mergedBreakpointRow.typography, mergedBreakpointRow.typo]);

    const maskedChildIndexedFlexProps = useMemo(() => {
        const raw = generatedProps.inProps;
        const nodes = children ?? content;

        if (!Array.isArray(raw)) return raw;

        if (nodes == null) return raw;

        return Children.map(nodes, (child, i) => {
            if (
                isValidElement(child) &&
                typeof child.type !== "string" &&
                child.type !== Fragment
            ) {
                return null;
            }
            return raw[i];
        });
    }, [generatedProps.inProps, children, content]);

    const mergedFlexChildren = useMemo(() => {
        const nodes = children ?? content;
        const common = mergedBreakpointRow.childrenCommon;
        const slots = mergedBreakpointRow.childrenProps;

        const hasCommon =
            common != null && typeof common === "object" && Object.keys(common).length > 0;
        const hasSlots =
            Array.isArray(slots) && slots.some((x) => x != null && typeof x === "object");

        if (!hasCommon && !hasSlots) return nodes;

        if (nodes == null) return nodes;

        return Children.map(nodes, (child, index) => {
            if (!isValidElement(child)) return child;
            if (typeof child.type === "string") return child;
            if (child.type === Fragment) return child;

            const slot = Array.isArray(slots) ? slots[index] ?? {} : {};
            const base = mergeCommonAndItem(common ?? {}, slot);
            const merged = { ...base };
            for (const [k, v] of Object.entries(child.props ?? {})) {
                if (k === "children") continue;
                if (v === undefined) delete merged[k];
                else merged[k] = v;
            }
            return cloneElement(child, merged);
        });
    }, [children, content, mergedBreakpointRow.childrenCommon, mergedBreakpointRow.childrenProps]);

    const rootSizingProps = useMemo(() => {
        const width = generatedProps.width ?? cssNormalizeSize(propsNorm?.width);
        const height = generatedProps.height ?? cssNormalizeSize(propsNorm?.height);

        const generatedFlexTrimmed =
            typeof generatedProps.flex === "string"
                ? generatedProps.flex.trim()
                : generatedProps.flex;
        const widthStr =
            typeof width === "string" ? width.trim() : width != null ? String(width) : "";

        const userProvidedFlex =
            (propsNorm?.flex != null && String(propsNorm.flex).trim() !== "") ||
            (bpOverrideRow?.flex != null && String(bpOverrideRow.flex).trim() !== "");

        const userProvidedFlexShrink =
            propsNorm?.flexShrink != null ||
            bpOverrideRow?.flexShrink != null ||
            propsNorm?.shrink != null ||
            bpOverrideRow?.shrink != null;

        /** width'ten otomatik üretilen `0 0 ${width}` ile width çiftini sade; kullanıcı flex verdiyse silme. */
        const skipAutoWidthFlexBasis =
            !userProvidedFlex &&
            Boolean(generatedFlexTrimmed) &&
            Boolean(widthStr) &&
            generatedFlexTrimmed === `0 0 ${widthStr}`;

        const fullInFlexParent = isFullShorthand && parentIsFlex;

        const shellFlex = fullInFlexParent
            ? FULL_WIDTH_FLEX_IN_FLEX_PARENT
            : skipAutoWidthFlexBasis
              ? undefined
              : generatedProps.flex;
        const shellFlexShrink =
            fullInFlexParent || (skipAutoWidthFlexBasis && !userProvidedFlexShrink)
                ? undefined
                : generatedProps.flexShrink;

        return {
            width,
            height,
            minWidth: generatedProps.minWidth ?? cssNormalizeSize(propsNorm?.minWidth),
            minHeight: generatedProps.minHeight ?? cssNormalizeSize(propsNorm?.minHeight),
            maxWidth: cssNormalizeSize(propsNorm?.maxWidth),
            maxHeight: cssNormalizeSize(propsNorm?.maxHeight),
            overflow: generatedProps.overflow,
            overflowX: generatedProps.overflowX,
            overflowY: generatedProps.overflowY,
            flex: shellFlex,
            flexGrow: fullInFlexParent ? undefined : generatedProps.flexGrow,
            flexShrink: shellFlexShrink,
            flexBasis: fullInFlexParent ? undefined : generatedProps.flexBasis,
            alignSelf: generatedProps.alignSelf,
            justifySelf: generatedProps.justifySelf,
            placeSelf: generatedProps.placeSelf,
            order: generatedProps.order,
        };
    }, [bpOverrideRow, generatedProps, isFullShorthand, parentIsFlex, propsNorm]);

    const surfaceFromGeneratedProps = useMemo(() => {
        const s = {};
        if (generatedProps.bgColor !== undefined) s.backgroundColor = generatedProps.bgColor;
        if (generatedProps.color !== undefined) s.color = generatedProps.color;
        if (generatedProps.background !== undefined) s.background = generatedProps.background;
        if (generatedProps.backgroundColor !== undefined)
            s.backgroundColor = generatedProps.backgroundColor;
        return Object.keys(s).length ? s : undefined;
    }, [generatedProps]);

    const shellChromeFromGenerated = useMemo(() => {
        const out = {};
        if (generatedProps.borderRadius != null) out.borderRadius = generatedProps.borderRadius;
        return Object.keys(out).length ? out : undefined;
    }, [generatedProps]);

    const transientTreeProps = useMemo(() => {
        const r = { ...generatedProps };
        for (const k of SHELL_SURFACE_PROP_KEYS) delete r[k];
        if (generatedProps.borderRadius != null) delete r.borderRadius;
        r.inProps = maskedChildIndexedFlexProps;
        r.width = rootSizingProps.width;
        r.height = rootSizingProps.height;
        r.minWidth = rootSizingProps.minWidth;
        r.minHeight = rootSizingProps.minHeight;
        r.maxWidth = rootSizingProps.maxWidth;
        r.maxHeight = rootSizingProps.maxHeight;
        r.overflow = rootSizingProps.overflow;
        r.overflowX = rootSizingProps.overflowX;
        r.overflowY = rootSizingProps.overflowY;
        r.flex = rootSizingProps.flex;
        r.flexGrow = rootSizingProps.flexGrow;
        r.flexShrink = rootSizingProps.flexShrink;
        r.flexBasis = rootSizingProps.flexBasis;
        r.alignSelf = rootSizingProps.alignSelf;
        r.justifySelf = rootSizingProps.justifySelf;
        r.placeSelf = rootSizingProps.placeSelf;
        r.order = rootSizingProps.order;
        return r;
    }, [generatedProps, maskedChildIndexedFlexProps, rootSizingProps]);

    const hasExplicitHeight = useMemo(
        () => rootSizingProps.height != null && rootSizingProps.height !== "",
        [rootSizingProps.height],
    );

    const rootStyle = useMemo(() => {
        const sizingOverrides = {
            width: rootSizingProps.width,
            height: rootSizingProps.height,
            minWidth: rootSizingProps.minWidth,
            minHeight: rootSizingProps.minHeight,
            maxWidth: rootSizingProps.maxWidth,
            maxHeight: rootSizingProps.maxHeight,
            overflow: rootSizingProps.overflow,
            overflowX: rootSizingProps.overflowX,
            overflowY: rootSizingProps.overflowY,
        };

        return mergeStyles(
            mergeStyles(mergeStyles(surfaceFromGeneratedProps, userRootStyle), shellChromeFromGenerated),
            sizingOverrides,
        );
    }, [surfaceFromGeneratedProps, userRootStyle, shellChromeFromGenerated, rootSizingProps]);

    const flexAriaLabel = useMemo(() => {
        const raw =
            mergedBreakpointRow?.["aria-label"] ??
            mergedBreakpointRow?.ariaLabel ??
            props?.["aria-label"] ??
            props?.ariaLabel;
        if (raw == null || raw === "") return "Flex";
        return String(raw).trim();
    }, [mergedBreakpointRow, props]);

    const domRestProps = useMemo(() => {
        const raw = getFlexDomRestProps(props);
        const { "aria-label": _a1, ariaLabel: _a2, ...rest } = raw;
        return rest;
    }, [props]);

    return useExportData(
        {
            exportData: props?.exportData,
            style,
            className,
            forwardedRef,
            rootRef,
            children,
            content,
            domRestProps,
            flexAriaLabel,
            mergedFlexChildren,
            typographyWrap,
            transientTreeProps,
            hasExplicitHeight,
            rootStyle,
        },
        {},
    );
};

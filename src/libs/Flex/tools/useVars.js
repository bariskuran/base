import {
    Children,
    Fragment,
    cloneElement,
    isValidElement,
    useMemo,
    useRef,
} from "react";
import { baseStore } from "../../@baseStore";
import { useExportData, useExportedData } from "../../useExportedData";
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
import { pickContainerSizing } from "./pickContainerSizing.js";
import { omitContainerSizingFromContent } from "./omitContainerSizingFromContent.js";
import { splitUserStyle, SHELL_SURFACE_PROP_KEYS } from "./splitUserStyle.js";
import { mergeStyles } from "./mergeStyles.js";
import { buildFlex2ScrollbarPadding } from "./buildFlex2ScrollbarPadding.js";
import { resolveFlexTypoWrap } from "./resolveFlexTypoWrap.js";

export const useVars = ({ props, children, content, className, style, forwardedRef }) => {
    const [currentBreakpoint] = baseStore.useGlobal((s) => [s._clientData.currentBreakpoint]);
    const contentRef = useRef(null);
    const containerRef = useRef(null);

    const propsNorm = useMemo(() => normalizeFlexPropsWithResponsiveAliases(props), [props]);

    const mergedBreakpointRow = useMemo(() => {
        const merged1 = deepMerge(sysDefaults, propsNorm);
        const bpOverride = propsNorm?.responsive?.[currentBreakpoint] || {};
        return mergeFlexKebabPropAliases(deepMerge(merged1, bpOverride));
    }, [propsNorm, currentBreakpoint]);

    /** Kök prop veya responsive breakpoint + isteğe bağlı scrollBarProps.disableScrollBar */
    const disableScrollBar = Boolean(
        mergedBreakpointRow.disableScrollBar ??
            (mergedBreakpointRow.scrollBarProps &&
                typeof mergedBreakpointRow.scrollBarProps === "object" &&
                mergedBreakpointRow.scrollBarProps.disableScrollBar),
    );

    const { exportData: exportDataForScrollBar, ...exportedData } = useExportedData();
    const childrenCount = Children.count(children ?? content);

    const { containerStyle: userContainerStyle, contentStyle: userContentStyle } = useMemo(
        () => splitUserStyle(style),
        [style],
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

    /** Bileşik çocuklar (Flex vb.): nth-child CSS kabuğa gidiyordu; maskelenip props clone ile içeri aktarılır. */
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

    const scrollBarPropsMergedRaw = useMemo(() => {
        const sb = mergedBreakpointRow.scrollBarProps;
        return sb && typeof sb === "object" ? sb : {};
    }, [mergedBreakpointRow.scrollBarProps]);

    const calculatedValue = useMemo(() => {
        if (disableScrollBar) {
            return buildFlex2ScrollbarPadding({}, { body: true });
        }
        return buildFlex2ScrollbarPadding(exportedData, scrollBarPropsMergedRaw);
    }, [disableScrollBar, exportedData, scrollBarPropsMergedRaw]);

    /**
     * Kabuk (S.container): ölçü, taşma, grid/flex-item hizası (alignSelf, justifySelf, placeSelf), order,
     * flexGrow/shrink/basis, padding/margin/borderRadius, yüzey renkleri.
     * İç flex (S.content): direction, gap, wrap, justifyContent/alignItems (justify/xAlign/yAlign → buraya),
     * placeContent/placeItems, alignContent, childrenProps; ortak taban childrenCommon (bileşik çocuklara cloneElement ile aktarılır; nth-child yalnızca doğrudan DOM çocuklarında).
     */
    const containerSizingProps = useMemo(() => {
        const width = generatedProps.width ?? cssNormalizeSize(propsNorm?.width);
        const height = generatedProps.height ?? cssNormalizeSize(propsNorm?.height);

        const generatedFlexTrimmed =
            typeof generatedProps.flex === "string"
                ? generatedProps.flex.trim()
                : generatedProps.flex;
        const widthStr =
            typeof width === "string" ? width.trim() : width != null ? String(width) : "";
        const skipAutoWidthFlexBasis =
            Boolean(generatedFlexTrimmed) &&
            Boolean(widthStr) &&
            generatedFlexTrimmed === `0 0 ${widthStr}`;

        const shellFlex = skipAutoWidthFlexBasis ? undefined : generatedProps.flex;
        const shellFlexShrink =
            generatedProps.flexShrink ?? (skipAutoWidthFlexBasis ? String(0) : undefined);

        return pickContainerSizing({
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
            flexGrow: generatedProps.flexGrow,
            flexShrink: shellFlexShrink,
            flexBasis: generatedProps.flexBasis,
            alignSelf: generatedProps.alignSelf,
            justifySelf: generatedProps.justifySelf,
            placeSelf: generatedProps.placeSelf,
            order: generatedProps.order,
        });
    }, [generatedProps, propsNorm]);

    const surfaceFromGeneratedProps = useMemo(() => {
        const s = {};
        if (generatedProps.bgColor !== undefined) s.backgroundColor = generatedProps.bgColor;
        if (generatedProps.color !== undefined) s.color = generatedProps.color;
        if (generatedProps.background !== undefined) s.background = generatedProps.background;
        if (generatedProps.backgroundColor !== undefined)
            s.backgroundColor = generatedProps.backgroundColor;
        return Object.keys(s).length ? s : undefined;
    }, [generatedProps]);

    /**
     * Kabuk (container): yalnızca köşe vb. ScrollBar’ın ayırdığı padding ($padding*) burada kalır;
     * kullanıcı padding/margin’i içerikte (S.content) — aksi halde inline padding scrollbar alanını ezer.
     */
    const shellChromeFromGenerated = useMemo(() => {
        const out = {};
        if (generatedProps.borderRadius != null) out.borderRadius = generatedProps.borderRadius;
        return Object.keys(out).length ? out : undefined;
    }, [generatedProps]);

    const contentStyleProps = useMemo(() => {
        const rest = { ...generatedProps };
        for (const k of SHELL_SURFACE_PROP_KEYS) delete rest[k];
        rest.inProps = maskedChildIndexedFlexProps;
        return omitContainerSizingFromContent(rest);
    }, [generatedProps, maskedChildIndexedFlexProps]);

    const hasExplicitShellHeight = useMemo(
        () => containerSizingProps.height != null && containerSizingProps.height !== "",
        [containerSizingProps.height],
    );

    const containerStyle = useMemo(() => {
        const sizingOverrides = {
            width: containerSizingProps.width,
            height: containerSizingProps.height,
            minWidth: containerSizingProps.minWidth,
            minHeight: containerSizingProps.minHeight,
            maxWidth: containerSizingProps.maxWidth,
            maxHeight: containerSizingProps.maxHeight,
            overflow: containerSizingProps.overflow,
            overflowX: containerSizingProps.overflowX,
            overflowY: containerSizingProps.overflowY,
        };

        return mergeStyles(
            mergeStyles(
                mergeStyles(surfaceFromGeneratedProps, userContainerStyle),
                shellChromeFromGenerated,
            ),
            sizingOverrides,
        );
    }, [
        surfaceFromGeneratedProps,
        userContainerStyle,
        shellChromeFromGenerated,
        containerSizingProps,
    ]);

    const contentStyle = userContentStyle;

    const flexAriaLabels = useMemo(() => {
        const raw = props?.["aria-label"];
        if (raw == null || raw === "") {
            return { container: "Flex container", content: "Flex content" };
        }
        const base = String(raw).trim();
        return {
            container: `${base}-container`,
            content: `${base}-content`,
        };
    }, [props]);

    const domRestProps = useMemo(() => {
        const raw = getFlexDomRestProps(props);
        if (raw["aria-label"] == null) return raw;
        const { "aria-label": _omitAria, ...rest } = raw;
        return rest;
    }, [props]);

    /** ScrollBar’a iletilecek props (disableScrollBar strip). */
    const scrollBarPropsForMount = useMemo(() => {
        const sb = mergedBreakpointRow.scrollBarProps;
        if (!sb || typeof sb !== "object") return {};
        const { disableScrollBar: _omitSb, ...rest } = sb;
        return rest;
    }, [mergedBreakpointRow.scrollBarProps]);

    return useExportData(
        {
            exportData: props?.exportData,
            style,
            className,
            forwardedRef,
            containerRef,
            children,
            content,
            domRestProps,
            flexAriaLabels,
            mergedFlexChildren,
            typographyWrap,
            contentRef,
            exportDataForScrollBar,
            containerSizingProps,
            contentStyleProps,
            hasExplicitShellHeight,
            containerStyle,
            contentStyle,
            calculatedValue,
            calculatedValues: calculatedValue,
            disableScrollBar,
            scrollBarProps: scrollBarPropsForMount,
        },
        calculatedValue,
    );
};

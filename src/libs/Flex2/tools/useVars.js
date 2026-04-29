import { Children, useMemo, useRef } from "react";
import { baseStore } from "../../@baseStore";
import { useExportData, useExportedData } from "../../useExportedData";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { generateProps } from "../../Flex/tools/generateProps";
import { getFlexDomRestProps } from "../../Flex/tools/getFlexDomRestProps";
import { sysDefaults } from "./sysDefaults.js";
import { pickContainerSizing } from "./pickContainerSizing.js";
import { omitContainerSizingFromContent } from "./omitContainerSizingFromContent.js";
import { splitUserStyle, SHELL_SURFACE_PROP_KEYS } from "./splitUserStyle.js";
import { mergeStyles } from "./mergeStyles.js";
import { buildFlex2ScrollbarPadding } from "./buildFlex2ScrollbarPadding.js";

export const useVars = ({ props, children, content, className, style, forwardedRef }) => {
    const [currentBreakpoint] = baseStore.useGlobal((s) => [s._clientData.currentBreakpoint]);
    const contentRef = useRef(null);
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

    const containerSizingProps = useMemo(() => {
        const width = generatedProps.width ?? cssNormalizeSize(props?.width);
        const height = generatedProps.height ?? cssNormalizeSize(props?.height);
        /**
         * generateRootFlexSizing (row + width) kabuğa flex: 0 0 <width> yazar.
         * Üst flex parent direction=column ise flex-basis ana eksende YÜKSEKLİK olur → width=100 iken height da 100rem gibi görünür.
         * Bu otomatik kısaltmayı kabuğa taşımayıp yalnızca flex-shrink: 0 ile genişlik korunur.
         */
        const generatedFlexTrimmed =
            typeof generatedProps.flex === "string" ? generatedProps.flex.trim() : generatedProps.flex;
        const widthStr = typeof width === "string" ? width.trim() : width != null ? String(width) : "";
        /** Row kök için üretilen flex hep genişlik bazlıdır; üst column'da yanlış eksene gider — height verilmiş olsa da aynı pattern. */
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
            minWidth: generatedProps.minWidth ?? cssNormalizeSize(props?.minWidth),
            minHeight: generatedProps.minHeight ?? cssNormalizeSize(props?.minHeight),
            maxWidth: cssNormalizeSize(props?.maxWidth),
            maxHeight: cssNormalizeSize(props?.maxHeight),
            overflow: generatedProps.overflow,
            overflowX: generatedProps.overflowX,
            overflowY: generatedProps.overflowY,
            flex: shellFlex,
            flexGrow: generatedProps.flexGrow,
            flexShrink: shellFlexShrink,
            flexBasis: generatedProps.flexBasis,
            alignSelf: generatedProps.alignSelf,
            order: generatedProps.order,
        });
    }, [generatedProps, props]);

    /** bgColor / color / background* Flex prop’ları kabukta; iç flex grid’de değil. */
    const surfaceFromGeneratedProps = useMemo(() => {
        const s = {};
        if (generatedProps.bgColor !== undefined) s.backgroundColor = generatedProps.bgColor;
        if (generatedProps.color !== undefined) s.color = generatedProps.color;
        if (generatedProps.background !== undefined) s.background = generatedProps.background;
        if (generatedProps.backgroundColor !== undefined)
            s.backgroundColor = generatedProps.backgroundColor;
        return Object.keys(s).length ? s : undefined;
    }, [generatedProps]);

    const contentStyleProps = useMemo(() => {
        const rest = { ...generatedProps };
        for (const k of SHELL_SURFACE_PROP_KEYS) delete rest[k];
        return omitContainerSizingFromContent(rest);
    }, [generatedProps]);

    /** Kabukta explicit height varken grid ilk satırı minmax(0,1fr) ile dikeyde dolabilir (ara shellClip olmadan). */
    const hasExplicitShellHeight = useMemo(
        () =>
            containerSizingProps.height != null &&
            containerSizingProps.height !== "",
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
            mergeStyles(surfaceFromGeneratedProps, userContainerStyle),
            sizingOverrides,
        );
    }, [surfaceFromGeneratedProps, userContainerStyle, containerSizingProps]);

    const contentStyle = userContentStyle;

    const domRestProps = useMemo(() => getFlexDomRestProps(props), [props]);

    const calculatedValue = useMemo(
        () => buildFlex2ScrollbarPadding(exportedData, props?.scrollBarProps || {}),
        [exportedData, props?.scrollBarProps],
    );

    return useExportData(
        {
            exportData: props?.exportData,
            style,
            className,
            forwardedRef,
            children,
            content,
            domRestProps,
            contentRef,
            exportDataForScrollBar,
            containerSizingProps,
            contentStyleProps,
            hasExplicitShellHeight,
            containerStyle,
            contentStyle,
            calculatedValue,
            calculatedValues: calculatedValue,
            scrollBarProps: props?.scrollBarProps || {},
        },
        calculatedValue,
    );
};

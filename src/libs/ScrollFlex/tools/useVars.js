import { useCallback, useMemo, useRef } from "react";
import { baseStore } from "../../baseStore";
import { useExportData } from "helpers/useExportedData";
import { isShallowEqual } from "../../isShallowEqual";
import { EMPTY_FLEX_PROPS, EMPTY_SCROLL_BAR_PROPS } from "./constants";
import { getContainerExtraInsetPx as getContainerExtraInsetPxFn } from "./containerExtraInset";
import { getLayoutSizeCss } from "./cssSizeUtils";
import {
    getBarGutterInsets,
    getShellLayoutStyle,
    pickScrollBarLayoutData,
    resolveScrollBarPropsForContentSizedLayout,
} from "./scrollBarLayout";
import { splitShellPaddingFromRestProps, getShellPaddingInsetsPx } from "./shellPadding";
import { getContainerWidth } from "./containerDimensions";
import { buildOrganizedFlexProps } from "./organizedFlexProps";
import { buildVariantOuterStyle } from "./buildVariantOuterStyle";
import {
    resolveContainerHeightSource,
    resolveContainerWidthSource,
} from "./containerDimensions";
import { useShellDrag } from "./useShellDrag";
import { useScrollFlexMeasureEffects } from "./useScrollFlexMeasureEffects";

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
        set,
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

            set((s) => {
                if (isShallowEqual(s.scrollBarExportedData, nextLayoutData)) return;
                s.scrollBarExportedData = nextLayoutData;
            });

            if (typeof userScrollBarExportData === "function") {
                userScrollBarExportData(data);
            }
        },
        [set, userScrollBarExportData],
    );

    const hasMaxWidthBound = maxWidth !== undefined && maxWidth !== null && maxWidth !== "";
    const hasMaxHeightBound = maxHeight !== undefined && maxHeight !== null && maxHeight !== "";

    const contentSizedHeight =
        !hasExplicitContainerHeight && !autoHeightEnabled && contentHeightPx > 0;

    const contentSizedWidth =
        !hasExplicitContainerWidth && !autoWidthEnabled && contentWidthPx > 0;

    const layoutScrollBarProps = useMemo(
        () => ({
            ...scrollBarProps,
            ...resolveScrollBarPropsForContentSizedLayout(scrollBarProps, {
                contentSizedHeight,
                contentSizedWidth,
            }),
        }),
        [scrollBarProps, contentSizedHeight, contentSizedWidth],
    );

    const mergedScrollBarProps = useMemo(
        () => ({
            ...layoutScrollBarProps,
            exportData,
            sourceByRef: scrollBarProps.sourceByRef ?? shellRef,
            positionSourceByRef: scrollBarProps.positionSourceByRef ?? containerRef,
        }),
        [containerRef, exportData, layoutScrollBarProps, scrollBarProps.sourceByRef],
    );

    const effectiveEnableDragging = enableDragging && !mergedScrollBarProps.fillMode;

    const barGutters = useMemo(
        () => getBarGutterInsets(scrollBarExportedData, layoutScrollBarProps),
        [layoutScrollBarProps, scrollBarExportedData],
    );

    const shellPaddingInsetsPx = useMemo(
        () => getShellPaddingInsetsPx(shellPaddingStyle),
        [shellPaddingStyle],
    );

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
        (axis) =>
            getContainerExtraInsetPxFn(axis, {
                barGutters,
                shellPaddingInsetsPx,
                containerBorderInsetsPx,
            }),
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
        () =>
            getShellLayoutStyle(scrollBarExportedData, layoutScrollBarProps, {
                contentSizedHeight,
                contentSizedWidth,
            }),
        [contentSizedHeight, contentSizedWidth, layoutScrollBarProps, scrollBarExportedData],
    );

    const organizedFlexProps = useMemo(
        () =>
            buildOrganizedFlexProps({
                flexProps,
                height,
                width,
                intrinsicWidth,
                hasMeasuredHeight,
                measuredHeight,
                hasExplicitContainerHeight,
                hasMaxHeightBound,
                autoHeightEnabled,
                explicitContainerWidthValue,
                restPropsWithoutShellPadding,
            }),
        [
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
        ],
    );

    useScrollFlexMeasureEffects({
        set,
        containerRef,
        shellRef,
        contentRef,
        hasExplicitContainerWidth,
        hasExplicitContainerHeight,
        hasWidthRefOrId,
        hasHeightRefOrId,
        autoWidthEnabled,
        autoHeightEnabled,
        widthByRef,
        widthById,
        heightByRef,
        heightById,
        scrollBarExportedData,
        scrollBarProps: layoutScrollBarProps,
        barGutters,
    });

    const variantOuterStyle = useMemo(
        () =>
            buildVariantOuterStyle({
                width,
                height,
                maxWidth,
                maxHeight,
                intrinsicWidth,
                hasExplicitContainerWidth,
                hasExplicitContainerHeight,
                hasMaxWidthBound,
                hasMaxHeightBound,
                hasWidthRefOrId,
                hasHeightRefOrId,
                autoWidthEnabled,
                autoHeightEnabled,
                autoWidthFlexGrow,
                autoWidthCapsToParent,
                autoHeightCapsToParent,
                measuredWidth,
                measuredHeight,
                contentWidthPx,
                contentHeightPx,
                barGutters,
                getContainerExtraInsetPx,
                needsShellViewport,
                restPropsWithoutShellPadding,
                resolveContainerWidthSource,
                resolveContainerHeightSource,
            }),
        [
            autoHeightCapsToParent,
            autoHeightEnabled,
            autoWidthCapsToParent,
            autoWidthEnabled,
            autoWidthFlexGrow,
            barGutters,
            contentHeightPx,
            contentWidthPx,
            scrollBarExportedData.showX,
            scrollBarExportedData.showY,
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
        ],
    );

    const { shellSurfaceStyle, shellPointerHandlers } = useShellDrag({
        enabled: effectiveEnableDragging,
        shellRef,
        contentRef,
    });

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

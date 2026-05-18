import { useMemo } from "react";
import { icons } from "./icons";
import { baseStore } from "../@baseStore";
import { createIconMeta, normalizeIconsLibrary, resolveThemeColor } from "./tools/iconMeta";
import { IconLayer } from "./tools/IconLayer";
import { PopTipWrapper } from "./tools/PopTipWrapper";
import { Root } from "./tools/styled";
import { resolveSize, resolveVisualScale } from "./tools/visualScale";

export const Icon = ({
    icon,
    color,
    bgColor,
    width = 14,
    size,
    w,
    hoverIcon: hoverIconProp,
    hoverColor,
    hoverBgColor,
    hoverScale,
    hoverWidth,
    hoverW,
    hoverSize,
    activeIcon: activeIconProp,
    activeColor,
    activeBgColor,
    activeScale,
    activeWidth,
    activeW,
    activeSize,
    pendingIcon: pendingIconProp,
    pendingColor,
    pendingBgColor,
    pendingScale,
    pendingWidth,
    pendingW,
    pendingSize,
    popTipProps = {},
    hoverManually = false,
    activeManually = false,
    clickEffectManually,
    pendingManually = false,
    disableScaleEffect = false,
    disablePulseEffect = false,
    flat = false,
    isFlag = false,
}) => {
    const [iconsLibraryRaw, theme] = baseStore.useGlobal((s) => [s._iconsLibrary, s.theme]);

    const { isSelfHover, setLocal } = baseStore.useLocal({
        isSelfHover: false,
    });

    const iconsLibrary = useMemo(() => normalizeIconsLibrary(iconsLibraryRaw), [iconsLibraryRaw]);
    const allIcons = useMemo(() => ({ ...icons, ...iconsLibrary }), [iconsLibrary]);

    const pendingState = !!pendingManually;
    const clickEffectControlled = clickEffectManually !== undefined;
    const activeFromClickEffect = clickEffectControlled ? !!clickEffectManually : false;
    const activeState =
        (!!activeManually || activeFromClickEffect) && !pendingState;
    const hoverState =
        !!(hoverManually || isSelfHover) && !activeState && !pendingState;

    const hoverGlyph = hoverIconProp || null;
    const activeGlyph = activeIconProp || null;
    const pendingGlyph = pendingIconProp || null;

    const baseMeta = useMemo(() => createIconMeta(icon, allIcons), [icon, allIcons]);
    const hoverMeta = useMemo(() => createIconMeta(hoverGlyph, allIcons), [hoverGlyph, allIcons]);
    const activeMeta = useMemo(
        () => createIconMeta(activeGlyph, allIcons),
        [activeGlyph, allIcons],
    );
    const pendingMeta = useMemo(
        () => createIconMeta(pendingGlyph, allIcons),
        [pendingGlyph, allIcons],
    );

    const finalColorRaw = pendingState
        ? pendingColor || color
        : activeState
          ? activeColor || color
          : hoverState
            ? hoverColor || color
            : color;
    const finalBgRaw = pendingState
        ? pendingBgColor || activeBgColor || hoverBgColor || bgColor
        : activeState
          ? activeBgColor || hoverBgColor || bgColor
          : hoverState
            ? hoverBgColor || bgColor
            : bgColor;

    const finalColor = resolveThemeColor(theme, finalColorRaw);
    const finalBg = resolveThemeColor(theme, finalBgRaw);
    const baseSize = resolveSize(size, w, width);

    const hoverScaleValue = resolveVisualScale({
        explicitScale: hoverScale,
        widthAlias: hoverWidth,
        widthAliasShort: hoverW,
        widthAliasSize: hoverSize,
        baseSize,
        fallback: 1,
    });

    const activeScaleValue = resolveVisualScale({
        explicitScale: activeScale,
        widthAlias: activeWidth,
        widthAliasShort: activeW,
        widthAliasSize: activeSize,
        baseSize,
        fallback: 1,
    });

    const pendingScaleValue = resolveVisualScale({
        explicitScale: pendingScale,
        widthAlias: pendingWidth,
        widthAliasShort: pendingW,
        widthAliasSize: pendingSize,
        baseSize,
        fallback: 1,
    });

    const finalScale = disableScaleEffect
        ? 1
        : pendingState
          ? pendingScaleValue
          : activeState
            ? activeScaleValue
            : hoverState
              ? hoverScaleValue
              : 1;

    const shouldRenderHoverLayer = !!(hoverIconProp && hoverMeta);
    const shouldRenderActiveLayer = !!(activeIconProp && activeMeta);
    const shouldRenderPendingLayer = !!(pendingIconProp && pendingMeta);
    const shouldUsePendingLayer = pendingState && shouldRenderPendingLayer;
    const shouldUseHoverLayer = hoverState && shouldRenderHoverLayer;
    const shouldUseActiveLayer = activeState && shouldRenderActiveLayer;
    const showBaseLayer =
        !shouldUsePendingLayer && !shouldUseHoverLayer && !shouldUseActiveLayer;
    const showHoverLayer = shouldUseHoverLayer;
    const showActiveLayer = shouldUseActiveLayer;
    const showPendingLayer = shouldUsePendingLayer;

    const pulseEnabled = !disablePulseEffect;

    if (!baseMeta) return null;

    /** Flat: `width` hedefi, kare ikonlardaki gibi uzun kenara (max(viewW,viewH)) hizalansın; dar view genişliği orantılı küçülür. */
    const viewLong = Math.max(baseMeta.viewW, baseMeta.viewH);
    const flatRootWidth = flat ? baseSize * (baseMeta.viewW / viewLong) : baseSize;

    return (
        <PopTipWrapper popTipProps={popTipProps}>
            <Root
                $size={baseSize}
                $flat={flat}
                $flatRootWidth={flatRootWidth}
                $aspectW={flat ? baseMeta.viewW : 1}
                $aspectH={flat ? baseMeta.viewH : 1}
                onMouseEnter={() =>
                    setLocal((s) => {
                        s.isSelfHover = true;
                    })
                }
                onMouseLeave={() =>
                    setLocal((s) => {
                        s.isSelfHover = false;
                    })
                }
                style={{
                    background: finalBg || "transparent",
                    borderRadius: "999px",
                    transition: "background 0.2s ease",
                }}
            >
                <IconLayer
                    meta={baseMeta}
                    visible={showBaseLayer}
                    fill={finalColor}
                    scale={finalScale}
                    spinPending={pendingState && showBaseLayer}
                    isFlag={isFlag}
                    enablePulse={
                        pulseEnabled &&
                        activeState &&
                        !shouldRenderActiveLayer &&
                        !pendingState
                    }
                    isActive={activeState}
                />

                {shouldRenderHoverLayer && (
                    <IconLayer
                        meta={hoverMeta}
                        visible={showHoverLayer}
                        fill={finalColor}
                        scale={finalScale}
                        isFlag={isFlag}
                        enablePulse={false}
                        isActive={false}
                    />
                )}

                {shouldRenderActiveLayer && (
                    <IconLayer
                        meta={activeMeta}
                        visible={showActiveLayer}
                        fill={finalColor}
                        scale={finalScale}
                        isFlag={isFlag}
                        enablePulse={pulseEnabled && activeState}
                        isActive={activeState}
                    />
                )}

                {shouldRenderPendingLayer && (
                    <IconLayer
                        meta={pendingMeta}
                        visible={showPendingLayer}
                        fill={finalColor}
                        scale={finalScale}
                        spinPending={showPendingLayer}
                        isFlag={isFlag}
                        enablePulse={false}
                        isActive={false}
                    />
                )}
            </Root>
        </PopTipWrapper>
    );
};

import { useEffect, useMemo, useState } from "react";
import { getBuiltInIcon, loadBuiltInIcon } from "./icons";
import { getBuiltInFlag, loadBuiltInFlag } from "../Flag/flags";
import { baseStore } from "../baseStore";
import {
    createIconMeta,
    normalizeIconsLibrary,
    resolveIconInput,
    resolveThemeColor,
} from "./tools/iconMeta";
import { IconLayer } from "./tools/IconLayer";
import { PopTipWrapper } from "./tools/PopTipWrapper";
import { Root } from "./tools/styled";
import { resolveSize, resolveVisualScale } from "./tools/visualScale";
import { Visibility } from "../Visibility";

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
    const [, setDefinitionVersion] = useState(0);

    const { isSelfHover, set } = baseStore.useLocal({
        isSelfHover: false,
    });

    const iconsLibrary = useMemo(() => normalizeIconsLibrary(iconsLibraryRaw), [iconsLibraryRaw]);

    const pendingState = !!pendingManually;
    const clickEffectControlled = clickEffectManually !== undefined;
    const activeFromClickEffect = clickEffectControlled ? !!clickEffectManually : false;
    const activeState = (!!activeManually || activeFromClickEffect) && !pendingState;
    const hoverState = !!(hoverManually || isSelfHover) && !activeState && !pendingState;

    const hoverGlyph = hoverIconProp || null;
    const activeGlyph = activeIconProp || null;
    const pendingGlyph = pendingIconProp || null;

    const glyphsToLoad = useMemo(
        () => [icon, hoverGlyph, activeGlyph, pendingGlyph].filter((glyph) => typeof glyph === "string"),
        [icon, hoverGlyph, activeGlyph, pendingGlyph],
    );
    const glyphsKey = glyphsToLoad.join("|");

    useEffect(() => {
        const load = isFlag ? loadBuiltInFlag : loadBuiltInIcon;
        let cancelled = false;

        Promise.all(glyphsToLoad.map((glyph) => load(glyph))).then(() => {
            if (!cancelled) setDefinitionVersion((version) => version + 1);
        });

        return () => {
            cancelled = true;
        };
    }, [glyphsKey, glyphsToLoad, isFlag]);

    const resolveDefinition = (glyph) => {
        const customDefinition = isFlag ? null : resolveIconInput(glyph, iconsLibrary);
        if (customDefinition) return customDefinition;
        if (typeof glyph !== "string") return resolveIconInput(glyph, {});
        return isFlag ? getBuiltInFlag(glyph) : getBuiltInIcon(glyph);
    };

    const baseDefinition = resolveDefinition(icon);
    const hoverDefinition = resolveDefinition(hoverGlyph);
    const activeDefinition = resolveDefinition(activeGlyph);
    const pendingDefinition = resolveDefinition(pendingGlyph);

    const baseMeta = useMemo(() => createIconMeta(baseDefinition), [baseDefinition]);
    const hoverMeta = useMemo(() => createIconMeta(hoverDefinition), [hoverDefinition]);
    const activeMeta = useMemo(
        () => createIconMeta(activeDefinition),
        [activeDefinition],
    );
    const pendingMeta = useMemo(
        () => createIconMeta(pendingDefinition),
        [pendingDefinition],
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
    const showBaseLayer = !shouldUsePendingLayer && !shouldUseHoverLayer && !shouldUseActiveLayer;
    const showHoverLayer = shouldUseHoverLayer;
    const showActiveLayer = shouldUseActiveLayer;
    const showPendingLayer = shouldUsePendingLayer;

    const pulseEnabled = !disablePulseEffect;

    if (!baseMeta) return null;

    const flatBoxW = baseMeta.contentBounds?.width || baseMeta.viewW;
    const flatBoxH = baseMeta.contentBounds?.height || baseMeta.viewH;
    const viewLong = Math.max(flatBoxW, flatBoxH);
    const flatRootWidth = flat ? baseSize * (flatBoxW / viewLong) : baseSize;

    return (
        <PopTipWrapper popTipProps={popTipProps}>
            <Root
                $size={baseSize}
                $flat={flat}
                $flatRootWidth={flatRootWidth}
                $aspectW={flat ? flatBoxW : 1}
                $aspectH={flat ? flatBoxH : 1}
                onMouseEnter={() =>
                    set((s) => {
                        s.isSelfHover = true;
                    })
                }
                onMouseLeave={() =>
                    set((s) => {
                        s.isSelfHover = false;
                    })
                }
                style={{
                    background: finalBg || "transparent",
                    borderRadius: "999px",
                    transition: "background 0.2s ease, background-color 0.2s ease, color 0.2s ease",
                }}
            >
                <IconLayer
                    meta={baseMeta}
                    visible={showBaseLayer}
                    fill={finalColor}
                    scale={finalScale}
                    spinPending={pendingState && showBaseLayer}
                    isFlag={isFlag}
                    disableOpticalScale={flat}
                    trimToContentBounds={flat}
                    enablePulse={
                        pulseEnabled && activeState && !shouldRenderActiveLayer && !pendingState
                    }
                    isActive={activeState}
                />

                <Visibility.mount
                    visible={shouldRenderHoverLayer}
                    content={
                        <IconLayer
                            meta={hoverMeta}
                            visible={showHoverLayer}
                            fill={finalColor}
                            scale={finalScale}
                            isFlag={isFlag}
                            disableOpticalScale={flat}
                            trimToContentBounds={flat}
                            enablePulse={false}
                            isActive={false}
                        />
                    }
                />

                <Visibility.mount
                    visible={shouldRenderActiveLayer}
                    content={
                        <IconLayer
                            meta={activeMeta}
                            visible={showActiveLayer}
                            fill={finalColor}
                            scale={finalScale}
                            isFlag={isFlag}
                            disableOpticalScale={flat}
                            trimToContentBounds={flat}
                            enablePulse={pulseEnabled && activeState}
                            isActive={activeState}
                        />
                    }
                />

                <Visibility.mount
                    visible={shouldRenderPendingLayer}
                    content={
                        <IconLayer
                            meta={pendingMeta}
                            visible={showPendingLayer}
                            fill={finalColor}
                            scale={finalScale}
                            spinPending={showPendingLayer}
                            isFlag={isFlag}
                            disableOpticalScale={flat}
                            trimToContentBounds={flat}
                            enablePulse={false}
                            isActive={false}
                        />
                    }
                />
            </Root>
        </PopTipWrapper>
    );
};

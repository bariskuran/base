import { isValidElement } from "react";
import { S } from "./tools/_styled.js";
import { useVars } from "./tools/useVars.js";
import { IconArea } from "./tools/IconArea.jsx";
import { ScaleWrapper } from "./tools/ScaleWrapper.jsx";
import { PopTip } from "../PopTip";

export const Base = (props = {}) => {
    const {
        size,
        isMatch, // pointer-events: none;
        Variant,
        prefix,
        isHovered,
        isActivated,
        label,
        variantProps,
        minWidth,
        hoverLabel,
        activeLabel,
        pendingLabel,
        isJustIcon,
        icon,
        suffix,
        showPendingLabel,
        showActiveLabel,
        showHoverLabel,
        showDefaultLabel,
        popTip,
        fullWidth,
        iconPalette,
        isPending,
        disabled,
    } = useVars(props);

    /* RETURN */
    return (
        <PopTipWrapper popTip={popTip}>
            <ScaleWrapper size={size} isMatch={isMatch} fullWidth={fullWidth} disabled={disabled}>
                <Variant {...variantProps}>
                    <IconArea
                        areaName="prefix"
                        obj={prefix}
                        iconPalette={iconPalette}
                        hoverManually={isHovered}
                        isActive={isActivated}
                        pendingManually={isPending}
                    />
                    {label != null && (
                        <div
                            data-slot="label"
                            style={minWidth ? { minWidth: `${minWidth}rem` } : {}}
                        >
                            <S.LabelStack>
                                <LabelLayer
                                    a={[showDefaultLabel, "label-default", label, true]}
                                    isJustIcon={isJustIcon}
                                />
                                <LabelLayer
                                    a={[showHoverLabel, "label-hover", hoverLabel, hoverLabel]}
                                    isJustIcon={isJustIcon}
                                />
                                <LabelLayer
                                    a={[showActiveLabel, "label-active", activeLabel, activeLabel]}
                                    isJustIcon={isJustIcon}
                                />
                                <LabelLayer
                                    a={[
                                        showPendingLabel,
                                        "label-pending",
                                        pendingLabel,
                                        pendingLabel,
                                    ]}
                                    isJustIcon={isJustIcon}
                                />
                            </S.LabelStack>
                        </div>
                    )}
                    {isJustIcon && (
                        <IconArea
                            areaName="centeredIcon"
                            obj={icon}
                            iconPalette={iconPalette}
                            hoverManually={isHovered}
                            isActive={isActivated}
                            pendingManually={isPending}
                        />
                    )}
                    <IconArea
                        areaName="suffix"
                        obj={suffix}
                        iconPalette={iconPalette}
                        hoverManually={isHovered}
                        isActive={isActivated}
                        pendingManually={isPending}
                    />
                </Variant>
            </ScaleWrapper>
        </PopTipWrapper>
    );
};

const PopTipWrapper = ({ popTip, children }) => {
    if (!popTip) return children;
    if (Array.isArray(popTip)) return children;

    if (isValidElement(popTip) || typeof popTip === "string") {
        return <PopTip content={popTip}>{children}</PopTip>;
    }

    if (typeof popTip === "object") {
        return <PopTip {...popTip}>{children}</PopTip>;
    }
    return null;
};

const LabelLayer = ({ a: [visible, name, children, condition] = [], isJustIcon }) =>
    condition && (
        <S.LabelLayer
            $visible={visible}
            data-slot={name}
            children={children}
            $isJustIcon={isJustIcon}
        />
    );

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
        c,
        isHovered,
        isActivated,
        label,
        variantProps,
        minWidth,
        activeLabel,
        hoverLabel,
        isJustIcon,
        icon,
        suffix,
        showActiveLabel,
        showHoverLabel,
        showDefaultLabel,
        popTip,
        fullWidth,
    } = useVars(props);

    /* RETURN */
    return (
        <PopTipWrapper popTip={popTip}>
            <ScaleWrapper size={size} isMatch={isMatch} fullWidth={fullWidth}>
                <Variant {...variantProps}>
                    <IconArea
                        areaName="prefix"
                        obj={prefix}
                        color={c}
                        hoverManually={isHovered}
                        isActive={isActivated}
                    />
                    {label != null && (
                        <div
                            data-slot="label"
                            style={minWidth ? { minWidth: `${minWidth}rem` } : {}}
                        >
                            <S.LabelStack>
                                <LabelLayer a={[showDefaultLabel, "label-default", label, true]} />
                                <LabelLayer
                                    a={[showHoverLabel, "label-hover", hoverLabel, hoverLabel]}
                                />
                                <LabelLayer
                                    a={[showActiveLabel, "label-active", activeLabel, activeLabel]}
                                />
                            </S.LabelStack>
                        </div>
                    )}
                    {isJustIcon && (
                        <IconArea
                            areaName="label"
                            obj={icon}
                            color={c}
                            hoverManually={isHovered}
                            isActive={isActivated}
                        />
                    )}
                    <IconArea
                        areaName="suffix"
                        obj={suffix}
                        color={c}
                        hoverManually={isHovered}
                        isActive={isActivated}
                    />
                </Variant>
            </ScaleWrapper>
        </PopTipWrapper>
    );
};

const PopTipWrapper = ({ popTip, children }) => {
    if (!popTip) return children;
    return <PopTip content={popTip}>{children}</PopTip>;
};

const LabelLayer = ({ a: [visible, name, children, condition] = [] }) =>
    condition && <S.LabelLayer $visible={visible} data-slot={name} children={children} />;

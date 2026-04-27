import { Icon } from "../../@Icon";
import { S } from "./_styled";

const TR = "transparent";

const orTransparent = (v) => (v != null && v !== "" ? v : TR);

export const IconArea = (props = {}) => {
    const { areaName, obj, hoverManually, isActive, pendingManually, iconPalette } = props;
    const {
        icon,
        color: colorFromItem,
        bgColor: bgColorFromItem,
        hoverBgColor: hoverBgColorFromItem,
        activeBgColor: activeBgColorFromItem,
        hoverColor: hoverColorFromItem,
        activeColor: activeColorFromItem,
        ...rest
    } = obj || {};

    const def = iconPalette?.default || {};
    const hov = iconPalette?.hover || {};
    const act = iconPalette?.active || {};
    const pen = iconPalette?.pending || {};

    if (!icon) return null;

    const iconBg = orTransparent(bgColorFromItem);
    const iconHoverBg = orTransparent(hoverBgColorFromItem);
    const iconActiveBg = orTransparent(activeBgColorFromItem);

    const wrapColor =
        colorFromItem ?? (pendingManually ? pen.color || def.color : def.color);

    return (
        <S.icon
            $areaName={areaName}
            data-slot={areaName}
            style={{
                background: iconBg,
                ...(wrapColor != null && wrapColor !== "" ? { color: wrapColor } : {}),
            }}
        >
            <Icon
                {...{
                    width: 18,
                    hoverManually,
                    activeManually: isActive,
                    pendingManually,
                    bgColor: iconBg,
                    hoverBgColor: iconHoverBg,
                    activeBgColor: iconActiveBg,
                    color: pendingManually ? pen.color || def.color : def.color,
                    hoverColor: hov.color,
                    activeColor: act.color,
                    pendingColor: pen.color,
                    ...rest,
                    icon,
                    ...(colorFromItem != null && colorFromItem !== "" ? { color: colorFromItem } : {}),
                    ...(hoverColorFromItem != null && hoverColorFromItem !== ""
                        ? { hoverColor: hoverColorFromItem }
                        : {}),
                    ...(activeColorFromItem != null && activeColorFromItem !== ""
                        ? { activeColor: activeColorFromItem }
                        : {}),
                }}
            />
        </S.icon>
    );
};

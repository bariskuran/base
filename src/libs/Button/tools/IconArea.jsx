import { Icon } from "../../Icon";
import { Flag } from "../../Flag";
import { colorConverter } from "../../colorConverter";
import { S } from "./_styled";

const TR = "transparent";

const orTransparent = (v) => (v != null && v !== "" ? v : TR);

const unusableAsIconInk = (c) => {
    if (c == null || c === "") return true;
    if (typeof c === "string" && c.trim().toLowerCase() === "transparent") return true;
    const f = colorConverter(c);
    if (f && typeof f.rgbaArray?.[3] === "number" && f.rgbaArray[3] < 0.02) return true;
    return false;
};

export const IconArea = (props = {}) => {
    const {
        areaName,
        obj,
        hoverManually,
        isActive,
        isClickEffectActive,
        clickEffectManually,
        pendingManually,
        iconPalette,
    } = props;
    const {
        icon,
        flag,
        color: colorFromItem,
        bgColor: bgColorFromItem,
        hoverBgColor: hoverBgColorFromItem,
        activeBgColor: activeBgColorFromItem,
        hoverColor: hoverColorFromItem,
        activeColor: activeColorFromItem,
        ...rest
    } = obj || {};

    const def = iconPalette?.default || {};
    const pen = iconPalette?.pending || {};
    const Visual = flag != null ? Flag : Icon;
    const visualIdentityProps = flag != null ? { flag } : { icon };

    if (flag == null && !icon) return null;

    const iconBg = orTransparent(bgColorFromItem);
    const iconHoverBg = orTransparent(hoverBgColorFromItem);
    const iconActiveBg = orTransparent(activeBgColorFromItem);

    const baseFromPalette = !unusableAsIconInk(def.color) ? def.color : undefined;

    const baseIconColor =
        colorFromItem != null && colorFromItem !== "" ? colorFromItem : baseFromPalette;


    const iconHoverColor =
        hoverColorFromItem != null && hoverColorFromItem !== ""
            ? hoverColorFromItem
            : baseIconColor;
    const iconActiveColor =
        activeColorFromItem != null && activeColorFromItem !== ""
            ? activeColorFromItem
            : baseIconColor;

    const iconPendingColor =
        pen?.color != null && pen.color !== "" && !unusableAsIconInk(pen.color)
            ? pen.color
            : baseIconColor;

    const wrapColor = pendingManually ? iconPendingColor : baseIconColor;

    const resolvedClickEffectManually =
        obj?.clickEffectManually !== undefined ? obj.clickEffectManually : clickEffectManually;

    const iconActiveManually =
        !!isActive ||
        (resolvedClickEffectManually === undefined && !!isClickEffectActive);

    return (
        <S.icon
            $areaName={areaName}
            data-slot={areaName}
            style={{
                ...(wrapColor != null && wrapColor !== "" ? { color: wrapColor } : {}),
            }}
        >
            <Visual
                {...{
                    width: 18,
                    hoverManually,
                    activeManually: iconActiveManually,
                    clickEffectManually: resolvedClickEffectManually,
                    pendingManually,
                    bgColor: iconBg,
                    hoverBgColor: iconHoverBg,
                    activeBgColor: iconActiveBg,
                    color: baseIconColor,
                    hoverColor: iconHoverColor,
                    activeColor: iconActiveColor,
                    pendingColor: iconPendingColor,
                    ...rest,
                    ...visualIdentityProps,
                }}
            />
        </S.icon>
    );
};

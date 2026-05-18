import { Icon } from "../../@Icon";
import { colorConverter } from "../../colorConverter";
import { S } from "./_styled";

const TR = "transparent";

const orTransparent = (v) => (v != null && v !== "" ? v : TR);

/** Paletten gelen görünmez mürekkep (ör. transparent); taban renk seçiminde yok sayılır. */
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

    if (!icon) return null;

    const iconBg = orTransparent(bgColorFromItem);
    const iconHoverBg = orTransparent(hoverBgColorFromItem);
    const iconActiveBg = orTransparent(activeBgColorFromItem);

    const baseFromPalette = !unusableAsIconInk(def.color) ? def.color : undefined;
    /** Kullanıcı color verdiyse o; vermediyse buton paletinin default ikon rengi. */
    const baseIconColor =
        colorFromItem != null && colorFromItem !== "" ? colorFromItem : baseFromPalette;

    /** hover/active: yalnızca icon nesnesinde açıkça verilirse paletten ayrı renk; yoksa her zaman baseIconColor (color ile aynı mantık). */
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
                background: iconBg,
                ...(wrapColor != null && wrapColor !== "" ? { color: wrapColor } : {}),
            }}
        >
            <Icon
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
                    icon,
                }}
            />
        </S.icon>
    );
};

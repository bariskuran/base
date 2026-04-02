import { Icon } from "../../@Icon";

export const IconArea = (props = {}) => {
    const { areaName, obj, hoverManually, isActive, color } = props;
    const { icon, color: colorFromItem, bgColor: bgColorFromItem } = obj || {};

    /* Return */
    if (!icon) return null;
    return (
        <div
            data-slot={areaName}
            style={{
                ...(bgColorFromItem ? { background: bgColorFromItem } : {}),
                ...(colorFromItem || color ? { color: colorFromItem || color } : {}),
            }}
        >
            <Icon
                {...{
                    width: 18,
                    color: colorFromItem || color,
                    hoverManually,
                    isActive,
                    ...obj,
                }}
            />
        </div>
    );
};

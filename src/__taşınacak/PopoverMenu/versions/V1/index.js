import { S } from "./_styled";
import { Icon } from "../../../Icon";
import { Dropdown } from "antd";

export const V1 = ({
    items,
    trigger,
    arrow,
    versionProps,
    onOpenChange,
    open,
    children,
    disabled,
    ...otherAntdProps
}) => {
    const { icon = "threeDots", width = 16 } = versionProps || {};

    /* Return */
    return (
        <Dropdown
            menu={{ items }}
            trigger={[trigger]}
            arrow={arrow}
            onOpenChange={onOpenChange}
            open={open}
            disabled={disabled}
            {...otherAntdProps}
        >
            {children || (
                <S.container
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    $isOpen={open}
                    $isDisabled={disabled}
                >
                    <Icon icon={icon} width={width} />
                </S.container>
            )}
        </Dropdown>
    );
};

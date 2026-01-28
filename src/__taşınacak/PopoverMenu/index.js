import { useMemo, useRef } from "react";
import { V1 } from "./versions/V1";
import { useDS } from "../useDashStore";
import { Icon } from "../Icon";
import { Confirmation } from "../Confirmation";
import { S } from "./_styled";

export const versions = {
    unstyled: V1,
    V1,
};

export const PopoverMenu = ({
    ver = "V1",
    items = [],
    trigger = "click",
    arrow = true,
    onOpenChange: externalOnOpenChange,
    versionProps = {},
    children,
    ...otherAntdProps
}) => {
    const blockClose = useRef(null);
    const timeRef = useRef(null);

    const { isOpen, isConfirmationOpen, set } = useDS({
        isOpen: false,
        isConfirmationOpen: false,
    });
    const Version = versions?.[ver] || versions.V1;

    const enableConfirmation = (index) => {
        blockClose.current = true;
        set({ isConfirmationOpen: index });
        timeRef.current = setTimeout(() => {
            blockClose.current = null;
        }, 500);
    };
    const disableConfirmation = () => {
        blockClose.current = null;
        set({ isConfirmationOpen: false });
        onOpenChange();
    };

    /* Prepare Items */
    const readyItems = useMemo(() => {
        const arr = [];

        items.forEach((it = {}, index) => {
            const { label, icon, onClick, href, disabled } = it;
            const { confirmation, danger } = it;

            const isDescription = !onClick && !href;

            const iconRow = (
                <div id="iconArea">
                    {icon && <Icon color={danger ? "error" : undefined} icon={icon} width={10} />}
                </div>
            );
            const row = !href ? label : <S.link to={href}>{label}</S.link>;

            const newLabel = isDescription ? (
                <S.row $isDescription>{label}</S.row>
            ) : !confirmation ? (
                <S.row $onClick={onClick}>
                    {iconRow}
                    {row}
                </S.row>
            ) : (
                <Confirmation
                    isConfirmationOpen={isConfirmationOpen === index}
                    onCancel={disableConfirmation}
                    onApprove={(e) => {
                        onClick?.(e);
                        disableConfirmation(e);
                    }}
                >
                    <S.row $onClick={onClick}>
                        {iconRow}
                        {row}
                    </S.row>
                </Confirmation>
            );

            arr.push({
                label: newLabel,
                disabled,
                danger,
                onClick: isDescription
                    ? false
                    : confirmation && !isConfirmationOpen
                      ? () => enableConfirmation(index)
                      : confirmation && isConfirmationOpen
                        ? disableConfirmation
                        : onClick,
                ...((onClick || href) && { key: index }),
                ...(!onClick && !href && { disabled: true }),
            });
        });

        return arr;
    }, [items, isConfirmationOpen, isOpen]);

    /* onOpenChange */
    const onOpenChange = (status) => {
        if (blockClose?.current) return;
        set({ isOpen: status, isConfirmationOpen: false });
        externalOnOpenChange?.(status);
    };

    /* Return */
    return (
        <Version
            {...{
                ...versionProps,
                items: isOpen ? readyItems : [],
                trigger,
                arrow,
                versionProps,
                onOpenChange,
                open: isOpen,
                disabled: !readyItems || readyItems.length < 1,
                ...otherAntdProps,
            }}
        >
            {children}
        </Version>
    );
};

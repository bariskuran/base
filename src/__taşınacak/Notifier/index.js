import { useEffect, useRef } from "react";
import { V1 } from "./variants/V1";
import { Icon } from "../Icon";
import { useDS } from "../useDashStore";
import { colorGetBackground } from "../colorGetBackground";

const versions = {
    default: V1,
    //
    V1,
};

export const Notifier = ({
    id,
    status,
    ver,
    title,
    info,
    onApprove,
    approveLabel,
    onCancel,
    cancelLabel,
    clearMe,
    clearAll,
}) => {
    const { bg, set } = useDS({});
    const ref = useRef(null);
    const Variant = versions?.[ver] || versions.default;
    useEffect(() => {
        set({ bg: colorGetBackground({ el: ref?.current }) });
    }, [ref]);

    const handleApprove = () => {
        onApprove && onApprove({ clearMe, clearAll, id });
        clearMe();
    };

    const handleCancel = () => {
        onCancel && onCancel();
        clearMe();
    };

    /* Return */
    return (
        <Variant.container ref={ref} $status={status} $fg={bg?.fgHex}>
            <Variant.iconArea>
                <Icon
                    icon={status === "success" ? "check" : "warning"}
                    width={20}
                    color="background"
                />
            </Variant.iconArea>
            <Variant.content>
                {title && <Variant.title>{title}</Variant.title>}
                <Variant.content>{info}</Variant.content>
                {(onCancel || onApprove) && (
                    <Variant.buttonArea>
                        {onCancel && (
                            <Variant.miniButton onClick={handleCancel}>
                                {cancelLabel}
                            </Variant.miniButton>
                        )}
                        {onApprove && (
                            <Variant.miniButton onClick={handleApprove}>
                                {approveLabel}
                            </Variant.miniButton>
                        )}
                    </Variant.buttonArea>
                )}
            </Variant.content>
            {!onCancel && !onApprove && (
                <Variant.closeArea onClick={clearMe}>
                    <Icon icon="close" width={12} color={bg?.fgHex} />
                </Variant.closeArea>
            )}
        </Variant.container>
    );
};

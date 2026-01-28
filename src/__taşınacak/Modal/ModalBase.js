import { Modal as AntModal } from "antd";
import { baseStore } from "../baseStore";
import { useBase } from "../useBase";

export const ModalBase = ({
    onClose: externalOnClose,
    onOpen: externalOnOpen,
    onOk: externalOnOk,
    onCancel: externalOnCancel,
    okText = "Confirm",
    cancelText = "Cancel",
    centered = false,
    title,
    width,
    footer,
    focusTriggerAfterClose = false,
    destroyOnClose = true,
    children,
    ...props
}) => {
    const [isModalEnabled, set] = useBase((s) => [s.isModalEnabled, s.set]);

    const closeModal = () => {
        set({ isModalEnabled: false });
    };
    const afterOpenChange = (boo) => {
        if (!boo) onClose();
        else onOpen();
    };
    const onClose = () => {
        externalOnClose?.(baseStore);
    };
    const onOpen = () => {
        externalOnOpen?.(baseStore);
    };
    const onCancel = () => {
        closeModal();
        externalOnCancel?.(baseStore);
    };
    const onOk = () => {
        closeModal();
        externalOnOk?.(baseStore);
    };

    /* Return */
    return (
        <AntModal
            open={isModalEnabled}
            destroyOnClose={destroyOnClose}
            okText={okText}
            cancelText={cancelText}
            centered={centered}
            title={title}
            width={width}
            onCancel={onCancel}
            onOk={onOk}
            afterOpenChange={afterOpenChange}
            focusTriggerAfterClose={focusTriggerAfterClose}
            footer={footer}
            {...props}
        >
            {children}
        </AntModal>
    );
};

import { ModalBase } from "../ModalBase";
import { useBase } from "../../useBase";
import { baseStore } from "../../baseStore";
import { FORM } from "../../FORM";

export const V1 = (props) => {
    const { onOk, onCancel, okText = "Confirm", cancelText = "Cancel" } = props || {};
    const [set] = useBase((s) => [s.set]);

    const closeModal = () => {
        set({ isModalEnabled: false });
    };

    const handleOk = () => {
        onOk(baseStore);
        closeModal();
    };
    const handleCancel = () => {
        onCancel(baseStore);
        closeModal();
    };

    return (
        <ModalBase
            {...props}
            footer={[
                <FORM.buttonArea key={1}>
                    <FORM.button
                        field={{
                            label: cancelText,
                            onClick: handleCancel,
                        }}
                        error
                    />
                    <FORM.button
                        key={2}
                        field={{
                            label: okText,
                            onClick: handleOk,
                        }}
                        sufIcon="fullArrowRight"
                        primary
                    />
                </FORM.buttonArea>,
            ]}
        />
    );
};

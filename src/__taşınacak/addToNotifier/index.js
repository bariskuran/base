import { baseStore } from "../baseStore";
import { generateRandomText } from "../generateRandomText";
import { removeFromNotifier } from "../removeFromNotifier";

const logWithStatus = (status, title, info) => {
    const styles = {
        notr: "background: #444444; color: white; padding: 2px 5px; border-radius: 3px;",
        error: "background: #D32F2F; color: white; padding: 2px 5px; border-radius: 3px;",
        success: "background: #2E7D32; color: white; padding: 2px 5px; border-radius: 3px;",
    };

    console.log(
        `%c${title ? `${title} ` : ""}${info}`,
        `${styles[status]}; font-weight: ${title ? "bold" : "normal"}`,
    );
};

export const addToNotifier = (props) => {
    const { set, notifierQueue, BASE_SETTINGS } = baseStore?.getState?.() || {};
    const { notifierManager } = BASE_SETTINGS || {};
    const {
        id = generateRandomText(16, true, true, true),
        title,
        info,
        status = "notr",
        killAfter = notifierManager?.killAfter || 10,
        onApprove,
        approveLabel = "Approve",
        onCancel,
        cancelLabel = "Dismiss",
        ver,
    } = props || {};

    const clearMe = () => removeFromNotifier(id);

    logWithStatus(status, title, info);

    set({
        notifierQueue: [
            ...notifierQueue,
            {
                id,
                title,
                info,
                status,
                killAfter,
                onApprove,
                approveLabel,
                onCancel,
                cancelLabel,
                clearMe,
                ver,
            },
        ],
    });

    if (killAfter > 0) {
        setTimeout(() => {
            clearMe();
        }, killAfter * 1000);
    }

    return id;
};

import { getText } from "../../getText";

export const getDefaultConfirmationContent = () => getText("areYouSure");

/** Default duration for content-button click feedback after confirm (ms). */
export const DEFAULT_TRIGGER_DELAY_MS = 2000;

export const DEFAULT_CONFIRM_BUTTON_PROPS = {
    label: getText("confirm"),
    bgColor: "success",
    size: 90,
    prefix: {
        icon: "check",
        width: 14,
    },
};

export const DEFAULT_CANCEL_BUTTON_PROPS = {
    label: getText("cancel"),
    bgColor: "error",
    outlined: true,
    size: 90,
    prefix: {
        icon: "close",
        width: 10,
    },
};

export const DEFAULT_CONTENT_BUTTON_PROPS = {
    prefix: {
        icon: "trash",
        width: 10,
    },
};

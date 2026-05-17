import { getText } from "../../getText";

export const getDefaultConfirmationContent = () => getText("areYouSure");

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

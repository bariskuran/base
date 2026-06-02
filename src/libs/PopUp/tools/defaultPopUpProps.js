import { getText } from "../../getText";

export const DEFAULT_USE_SCROLL_FLEX = false;

export const POPUP_HEADER_BLOCK_REM = 44;

export const DEFAULT_CLOSE_BUTTON_PROPS = {
    icon: { icon: "close", width: 10 },
};

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

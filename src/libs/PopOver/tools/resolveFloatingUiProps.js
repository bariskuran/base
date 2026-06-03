import { resolvePathOrRaw } from "../../Button/tools/generateColors.js";

export const resolveFloatingUiProps = (rest, theme) => {
    const next = { ...rest };
    const bg = next.bgColor;
    const fg = next.color;

    if (bg != null && bg !== "") {
        const r = resolvePathOrRaw(theme, typeof bg === "string" ? bg : String(bg));
        if (r != null) next.bgColor = r;
    }
    if (fg != null && fg !== "") {
        const r = resolvePathOrRaw(theme, typeof fg === "string" ? fg : String(fg));
        if (r != null) next.color = r;
    }

    if (next.popOverTriggerMarker == null) next.popOverTriggerMarker = true;
    if (next.disableAutoClose) {
        delete next.popOverOutsideDismiss;
    } else {
        next.popOverOutsideDismiss = true;
    }

    return next;
};

import { DEFAULT_REM_SETTINGS } from "../../../constants/DEFAULT_REM_SETTINGS";

export const prepareRemSettings = ({ remSettings = DEFAULT_REM_SETTINGS, mediaFunctions }) => {
    const mixin = mediaFunctions?.freeBpMixin?.("font-size", remSettings);
    return mixin;
};

import { useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { typeOf } from "../../typeOf";

export const BaseDateProvider = ({ baseDateSettings = {} }) => {
    useEffect(() => {
        if (baseDateSettings && typeOf(baseDateSettings) === "object") {
            try {
                baseStore.globalData.set({
                    baseDateSettings: baseDateSettings,
                });
            } catch (error) {
                console.error("GlobalDataProvider: Failed to set baseDateSettings", error);
            }
        }
    }, [baseDateSettings]);
    return null;
};

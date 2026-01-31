import { useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { typeOf } from "../../typeOf";

export const GlobalDataProvider = ({ globalCoreStoreVariables = {} }) => {
    useEffect(() => {
        if (globalCoreStoreVariables && typeOf(globalCoreStoreVariables) === "object") {
            try {
                baseStore.globalData.set({
                    ...baseStore.globalData.get(),
                    ...globalCoreStoreVariables,
                });
            } catch (error) {
                console.error("GlobalDataProvider: Failed to set globalData", error);
            }
        }
    }, [globalCoreStoreVariables]);
    return null;
};

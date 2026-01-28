import { useEffect } from "react";
import { baseStore } from "../../@baseStore";

export const GlobalDataProvider = ({ globalCoreStoreVariables, theme }) => {
    useEffect(() => {
        if (globalCoreStoreVariables && typeof globalCoreStoreVariables === "object") {
            baseStore.globalData.set({
                ...baseStore.globalData.get(),
                ...globalCoreStoreVariables,
                theme,
            });
        }
    }, [globalCoreStoreVariables]);
    return null;
};

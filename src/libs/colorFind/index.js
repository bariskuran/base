import { baseStore } from "../@baseStore";

export const colorFind = (string) => {
    const theme = baseStore.globalData.get?.()?.theme || {};
};

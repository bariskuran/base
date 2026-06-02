import { baseStore } from "../baseStore";

export const logReferrers = (...args) => {
    const { isDevMode } = baseStore.globalData.get();
    if (!isDevMode) return;
    console.log(...args, new Error().stack);
};

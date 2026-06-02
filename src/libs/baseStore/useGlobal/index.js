import { use } from "../use";
import { globalData } from "../globalData";

export const useGlobal = (selector) => {
    const state = use(globalData, selector);
    return state ?? {};
};

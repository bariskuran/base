import { use } from "../use";
import { clientData } from "../clientData";
export const useClient = (selector) => {
    const state = use(clientData, selector);
    return state || {};
};

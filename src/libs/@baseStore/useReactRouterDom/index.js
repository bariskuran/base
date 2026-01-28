import { use } from "../use";
import { reactRouterDomData } from "../reactRouterDomData";

export const useReactRouterDom = (selector) => {
    const state = use(reactRouterDomData, selector);
    return state || {};
};

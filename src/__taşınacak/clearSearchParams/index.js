import { rrdStore } from "../RrdGlobals";

export const clearSearchParams = () => {
    const { navigate } = rrdStore?.getState() || {};
    navigate(`${location?.pathname}`, { replace: true });
};

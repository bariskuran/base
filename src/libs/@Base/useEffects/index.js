import { useEffect } from "react";
import { logReferrers } from "../../logReferrers";

export const useEffects = () => {
    /* Add console.ref into window */
    useEffect(() => {
        window.console.ref = logReferrers;
    }, []);

    /* Return null */
    return null;
};

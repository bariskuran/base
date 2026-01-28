import { useEffect } from "react";
import { useScrollWidthHeight } from "libs/useScrollWidthHeight";

export const ScrollDown = ({ temporary }) => {
    const [, h] = useScrollWidthHeight();

    /* */
    useEffect(() => {
        if (!temporary) return;
        window.scrollTo({ top: temporary || 0, behavior: "instant" });
    }, [h]);

    /* */
    return null;
};

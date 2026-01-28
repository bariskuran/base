import { useEffect } from "react";
import { useEventListener } from "../../useEventListener";
import { getClientData } from "../../@baseStore/clientData/getClientData";
import { baseStore } from "../../@baseStore";

export const ClientDataProvider = ({ breakpoints, maxAspRatio, minAspRatio }) => {
    const updateClientData = () => {
        const generatedClientData = getClientData({ breakpoints, maxAspRatio, minAspRatio });
        baseStore.clientData.set(generatedClientData || {});
    };
    useEventListener("resize", updateClientData, { getFirst: false });
    useEffect(() => updateClientData(), [breakpoints, maxAspRatio, minAspRatio]);

    /* Return */
    return null;
};

import { useEffect } from "react";
import { logReferrers } from "../../logReferrers";
import { createBaseDatePackage } from "../../baseDate/createBaseDatePackage";
import { baseStore } from "../../baseStore";
import { useTimer } from "../../useTimer";

export const useEffects = () => {
    const [_baseDate = {}, set] = baseStore.useGlobal((s) => [s._baseDate, s.set]);


    useEffect(() => {
        window.console.ref = logReferrers;
    }, []);


    const startTimeout = () => {
        const timezone = _baseDate?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const datePackage = createBaseDatePackage({ timezone });

        set((s) => {
            s._baseDate.package = datePackage;
        });

        const getHoursAndMinutes = (tsTillEndOfDay) => {
            const hours = Math.floor(tsTillEndOfDay / 3600000);
            const minutes = Math.floor((tsTillEndOfDay % 3600000) / 60000);
            return `${hours}h ${minutes}m`;
        };
        console.log(
            `[baseDate] is up to date. Today: ${datePackage.today.defaultString}. It is valid for ${getHoursAndMinutes(datePackage.tsTillEndOfDay)}.`,
        );
        start({ refreshTime: datePackage.tsTillEndOfDay });
    };
    const { start } = useTimer({
        timerName: "BaseDateProvider",
        loop: false,
        onEnd: startTimeout,
        startOnLoad: false,
    });
    useEffect(() => {
        startTimeout();
    }, []);


    return null;
};

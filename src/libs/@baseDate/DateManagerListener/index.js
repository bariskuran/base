import { useEffect, useRef } from "react";
import { useBase } from "../useBase";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

export const DateManagerListener = () => {
    const [refreshDate, date, dateFirstDayOfWeek] = useBase((s) => [
        s.refreshDate,
        s.date,
        s.BASE_SETTINGS?.dateManager?.firstDayOfWeek,
    ]);
    const timeout = useRef(null);

    const updateTimeout = () => {
        const { year, month, day } = date.now.props();
        const diffTs = date.now.getTimeDifference(new Date(year, month, day + 1, 0, 0, 0, 0)).ts;
        timeout.current = setTimeout(callRefreshDates, diffTs);
    };

    const callRefreshDates = () => {
        refreshDate();
        console.log(
            "Date variables are refreshed by Date ManagerListener.",
            date.now.format("YYYY/MM/DD HH:NN"),
        );
        updateTimeout();
    };

    useEffect(() => {
        updateTimeout();

        return () => {
            clearTimeout(timeout.current);
        };
    }, []);

    useEffect(() => {
        dayjs.extend(updateLocale);
        dayjs.updateLocale("en", {
            weekStart: dateFirstDayOfWeek || 1,
        });
    }, [dateFirstDayOfWeek]);

    return null;
};

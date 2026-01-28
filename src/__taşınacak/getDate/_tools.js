import { baseStore } from "../baseStore";

/* getDefaults */
export const defaultFormat = "DD-MM-YY";
export const defaultFirstDayOfWeek = 1;
export const getDefaults = (incomingFormat, incomingFirstDayOfWeek) => {
    const BASE_SETTINGS = baseStore?.getState()?.BASE_SETTINGS;
    return {
        format: incomingFormat || BASE_SETTINGS?.dateManager?.dateFormat || defaultFormat,
        firstDayOfWeek:
            incomingFirstDayOfWeek ||
            BASE_SETTINGS?.dateManager?.dateFirstDayOfWeek ||
            defaultFirstDayOfWeek,
    };
};

/* prepareProps */
export const prepareProps = (d) => {
    return {
        year: d.getFullYear(),
        month: d.getMonth(),
        monthName: d.toLocaleString("default", { month: "short" }),
        day: d.getDate(),
        dayName: d.toLocaleDateString("default", { weekday: "short" }),
        dayOfWeek: d.getDay(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
        millisecond: d.getMilliseconds(),
        ts: d.getTime(),
    };
};

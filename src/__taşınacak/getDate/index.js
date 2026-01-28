import dayjs from "dayjs";
import { DateClass } from "./DateClass";
import { defaultFormat, getDefaults } from "./_tools";
import { calculateNewDate as cND } from "../calculateNewDate";

export const getDate = (incomingFormat, incomingFirstDayOfWeek) => {
    const { format, firstDayOfWeek: fdow } = getDefaults(incomingFormat, incomingFirstDayOfWeek);

    const NOW = new Date();

    const ye = NOW.getFullYear(),
        mo = NOW.getMonth(), // Jan is 0
        da = NOW.getDate(), // calendar day. For ex 31
        daWe = NOW.getDay(), // Sunday is 0
        daWeWithfdow = daWe - fdow < 0 ? 6 : daWe - fdow,
        // ho = NOW.getHours(),
        // mi = NOW.getMinutes(),
        // se = NOW.getSeconds(),
        // ms = NOW.getMilliseconds(),
        //
        today = new Date(ye, mo, da, 0, 0, 0, 0),
        todayEnd = new Date(ye, mo, da, 23, 59, 59, 999),
        tomorrow = cND(today, { day: 1 }),
        tomorrowEnd = cND(todayEnd, { day: 1 }),
        yesterday = cND(today, { day: -1 }),
        yesterdayEnd = cND(todayEnd, { day: -1 }),
        nextWeekStart = cND(today, { day: 7 - daWeWithfdow }),
        nextWeekEnd = cND(nextWeekStart, { day: 6, hour: [23, 59, 59, 999] }),
        thisWeekStart = cND(today, { day: -daWeWithfdow }),
        thisWeekEnd = NOW,
        lastWeekStart = cND(today, { day: -daWeWithfdow - 7 }),
        lastWeekEnd = cND(lastWeekStart, { day: 6, hour: [23, 59, 59, 999] }),
        //
        thisMonthStart = new Date(ye, mo, 1, 0, 0, 0, 0),
        thisMonthEnd = cND(thisMonthStart, { month: 1, millisecond: -1 }),
        nextMonthStart = cND(thisMonthStart, { month: 1 }),
        nextMonthEnd = cND(nextMonthStart, { month: 1, millisecond: -1 }),
        lastMonthStart = cND(thisMonthStart, { month: -1 }),
        lastMonthEnd = cND(thisMonthStart, { millisecond: -1 }),
        //
        thisYearStart = new Date(ye, 0, 1, 0, 0, 0, 0),
        thisYearEnd = cND(thisYearStart, { year: 1, millisecond: -1 }),
        nextYearStart = cND(thisYearStart, { year: 1 }),
        nextYearEnd = cND(nextYearStart, { year: 1, millisecond: -1 }),
        lastYearStart = cND(thisYearStart, { year: -1 }),
        lastYearEnd = cND(thisYearStart, { millisecond: -1 }),
        //
        last7Days = cND(NOW, { day: -7 }),
        last15Days = cND(NOW, { day: -15 }),
        last30Days = cND(NOW, { day: -30 }),
        last45Days = cND(NOW, { day: -45 }),
        last60Days = cND(NOW, { day: -60 }),
        last90Days = cND(NOW, { day: -90 }),
        last180Days = cND(NOW, { day: -180 });

    // new Date(Year, Month, Day, Hour, Minute, Second, Milisecond)
    const cl = {
        today,
        todayEnd,
        tomorrow,
        tomorrowEnd,
        yesterday,
        yesterdayEnd,
        nextWeekStart,
        nextWeekEnd,
        thisWeekStart,
        thisWeekEnd,
        lastWeekStart,
        lastWeekEnd,
        thisMonthStart,
        thisMonthEnd,
        nextMonthStart,
        nextMonthEnd,
        lastMonthStart,
        lastMonthEnd,
        thisYearStart,
        thisYearEnd,
        nextYearStart,
        nextYearEnd,
        lastYearStart,
        lastYearEnd,
        last7Days,
        last15Days,
        last30Days,
        last45Days,
        last60Days,
        last90Days,
        last180Days,
    };

    const date = {
        firstDayOfWeek: fdow,
        systemFormat: defaultFormat,
        format: format,
        createdAt: NOW.getTime(),
        DateClass,

        presets: (d, format) => [
            {
                id: "today",
                label: "Today",
                value: [dayjs(today), dayjs(todayEnd)],
                set: [d.today.format(format), d.todayEnd.format(format)],
            },
            {
                id: "yesterday",
                label: "Yesterday",
                value: [dayjs(yesterday), dayjs(yesterdayEnd)],
                set: [d.yesterday.format(format), d.yesterdayEnd.format(format)],
            },
            {
                id: "thisWeek",
                label: "This Week",
                value: [dayjs(thisWeekStart), dayjs(thisWeekEnd)],
                set: [d.thisWeekStart.format(format), d.thisWeekEnd.format(format)],
            },
            {
                id: "lastWeek",
                label: "Last Week",
                value: [dayjs(lastWeekStart), dayjs(lastWeekEnd)],
                set: [d.lastWeekStart.format(format), d.lastWeekEnd.format(format)],
            },
            {
                id: "thisMonth",
                label: "This Month",
                value: [dayjs(thisMonthStart), dayjs(NOW)],
                set: [d.thisMonthStart.format(format), d.now.format(format)],
            },

            {
                id: "lastMonth",
                label: "Last Month",
                value: [dayjs(lastMonthStart), dayjs(lastMonthEnd)],
                set: [d.lastMonthStart.format(format), d.lastMonthEnd.format(format)],
            },
            {
                id: "last7Days",
                label: "Last 7 Days",
                value: [dayjs(last7Days), dayjs(NOW)],
                set: [d.last7Days.format(format), d.now.format(format)],
            },
            {
                id: "last15Days",
                label: "Last 15 Days",
                value: [dayjs(last15Days), dayjs(NOW)],
                set: [d.last15Days.format(format), d.now.format(format)],
            },
            {
                id: "last30Days",
                label: "Last 30 Days",
                value: [dayjs(last30Days), dayjs(NOW)],
                set: [d.last30Days.format(format), d.now.format(format)],
            },
            {
                id: "last60Days",
                label: "Last 60 Days",
                value: [dayjs(last60Days), dayjs(NOW)],
                set: [d.last60Days.format(format), d.now.format(format)],
            },
            {
                id: "last90Days",
                label: "Last 90 Days",
                value: [dayjs(last90Days), dayjs(NOW)],
                set: [d.last90Days.format(format), d.now.format(format)],
            },
        ],

        now: new DateClass(undefined, format, true),
    };

    Object.entries(cl).forEach(([key, value]) => {
        date[key] = new DateClass(value, format);
    });

    return date;
};

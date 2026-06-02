import { baseDate, getNow } from "../baseDate";
import { baseStore } from "../baseStore";

const getDefaults = () => {
    const { _baseDate } = baseStore?.globalData?.get?.() || {};
    const { defaultFormat, firstDayOfWeek, timezone } = _baseDate || {};
    return { defaultFormat, firstDayOfWeek, timezone };
};

const weekdayIndexInTz = (timestamp, timezone) => {
    try {
        const name = new Intl.DateTimeFormat("en-US", {
            timeZone: typeof timezone === "string" ? timezone : undefined,
            weekday: "short",
        }).format(new Date(timestamp));
        const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        return map[name] ?? new Date(timestamp).getDay();
    } catch {
        return new Date(timestamp).getDay();
    }
};

const startOfDayTs = (nowTs, timezone) => {
    const y = Number(baseDate({ initial: nowTs, timezone, format: "|YYYY|" }));
    const m = Number(baseDate({ initial: nowTs, timezone, format: "|MM|" }));
    const d = Number(baseDate({ initial: nowTs, timezone, format: "|DD|" }));

    return baseDate({
        initial: { year: y, month: m, day: d, hour: 0, minute: 0, second: 0, millisecond: 0 },
        timezone,
        format: "timestamp",
    });
};

const endOfDayTs = (dayStartTs, timezone) => {
    const nextStart = baseDate({
        initial: dayStartTs,
        timezone,
        calc: { day: 1 },
        format: "timestamp",
    });
    return nextStart - 1;
};

const startOfMonthTs = (nowTs, timezone) => {
    const y = Number(baseDate({ initial: nowTs, timezone, format: "|YYYY|" }));
    const m = Number(baseDate({ initial: nowTs, timezone, format: "|MM|" }));
    return baseDate({
        initial: { year: y, month: m, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
        timezone,
        format: "timestamp",
    });
};

const startOfYearTs = (nowTs, timezone) => {
    const y = Number(baseDate({ initial: nowTs, timezone, format: "|YYYY|" }));
    return baseDate({
        initial: { year: y, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
        timezone,
        format: "timestamp",
    });
};

const makePoint = ({ timestamp, timezone, defaultFormat, longFormat }) => {
    const ts = Number(timestamp);

    return {
        timestamp: ts,
        defaultString: baseDate({ initial: ts, timezone, format: defaultFormat }),
        longString: baseDate({ initial: ts, timezone, format: longFormat }),
        calc: (delta, overrides = {}) =>
            baseDate({
                initial: ts,
                timezone,
                calc: delta && typeof delta === "object" ? delta : undefined,
                ...overrides,
            }),
    };
};

const makeLastDaysRange = ({ endDayStartTs, daysBackInclusive, timezone, defaultFormat }) => {
    const endTs = endOfDayTs(endDayStartTs, timezone);

    const startTs = baseDate({
        initial: endDayStartTs,
        timezone,
        calc: { day: -(daysBackInclusive - 1) },
        format: "timestamp",
    });

    return {
        default: [
            baseDate({ initial: startTs, timezone, format: defaultFormat }),
            baseDate({ initial: endTs, timezone, format: defaultFormat }),
        ],
        timestamps: [startTs, endTs],
    };
};

export const createBaseDatePackage = (opts = {}) => {
    const { defaultFormat, firstDayOfWeek, timezone: storeTz } = getDefaults();

    const tz =
        typeof opts.timezone === "number" && Number.isFinite(opts.timezone)
            ? opts.timezone
            : typeof opts.timezone === "string" && opts.timezone.trim()
              ? opts.timezone.trim()
              : storeTz;

    const longFormat = "|DD|/|MM|/|YYYY| |HH|:|NN|:|SS|";

    const nowTs = Date.now();
    const getNowInTz = (opts = {}) => {
        const { format, timezone } = opts || {};
        return getNow({ format, timezone: timezone ?? tz });
    };

    const todayStartTs = startOfDayTs(nowTs, tz);
    const todayEndTs = endOfDayTs(todayStartTs, tz);

    const tomorrowStartTs = baseDate({
        initial: todayStartTs,
        timezone: tz,
        calc: { day: 1 },
        format: "timestamp",
    });
    const tomorrowEndTs = endOfDayTs(tomorrowStartTs, tz);

    const yesterdayStartTs = baseDate({
        initial: todayStartTs,
        timezone: tz,
        calc: { day: -1 },
        format: "timestamp",
    });
    const yesterdayEndTs = endOfDayTs(yesterdayStartTs, tz);


    const wd = weekdayIndexInTz(todayStartTs, tz);
    const deltaThisWeekStart = (wd - firstDayOfWeek + 7) % 7;

    const thisWeekStartTs = baseDate({
        initial: todayStartTs,
        timezone: tz,
        calc: { day: -deltaThisWeekStart },
        format: "timestamp",
    });

    const thisWeekEndTs = endOfDayTs(
        baseDate({
            initial: thisWeekStartTs,
            timezone: tz,
            calc: { day: 6 },
            format: "timestamp",
        }),
        tz,
    );

    const nextWeekStartTs = baseDate({
        initial: thisWeekStartTs,
        timezone: tz,
        calc: { day: 7 },
        format: "timestamp",
    });

    const nextWeekEndTs = endOfDayTs(
        baseDate({
            initial: nextWeekStartTs,
            timezone: tz,
            calc: { day: 6 },
            format: "timestamp",
        }),
        tz,
    );

    const lastWeekStartTs = baseDate({
        initial: thisWeekStartTs,
        timezone: tz,
        calc: { day: -7 },
        format: "timestamp",
    });

    const lastWeekEndTs = endOfDayTs(
        baseDate({
            initial: lastWeekStartTs,
            timezone: tz,
            calc: { day: 6 },
            format: "timestamp",
        }),
        tz,
    );


    const thisMonthStartTs = startOfMonthTs(nowTs, tz);
    const nextMonthStartTs = baseDate({
        initial: thisMonthStartTs,
        timezone: tz,
        calc: { month: 1 },
        format: "timestamp",
    });
    const lastMonthStartTs = baseDate({
        initial: thisMonthStartTs,
        timezone: tz,
        calc: { month: -1 },
        format: "timestamp",
    });

    const thisMonthEndTs = nextMonthStartTs - 1;
    const nextMonthEndTs =
        baseDate({
            initial: nextMonthStartTs,
            timezone: tz,
            calc: { month: 1 },
            format: "timestamp",
        }) - 1;
    const lastMonthEndTs = thisMonthStartTs - 1;


    const thisYearStartTs = startOfYearTs(nowTs, tz);
    const nextYearStartTs = baseDate({
        initial: thisYearStartTs,
        timezone: tz,
        calc: { year: 1 },
        format: "timestamp",
    });
    const lastYearStartTs = baseDate({
        initial: thisYearStartTs,
        timezone: tz,
        calc: { year: -1 },
        format: "timestamp",
    });

    const thisYearEndTs = nextYearStartTs - 1;
    const nextYearEndTs =
        baseDate({
            initial: nextYearStartTs,
            timezone: tz,
            calc: { year: 1 },
            format: "timestamp",
        }) - 1;
    const lastYearEndTs = thisYearStartTs - 1;

    const day = {
        ...makePoint({ timestamp: todayStartTs, timezone: tz, defaultFormat, longFormat }),
        value: Number(baseDate({ initial: todayStartTs, timezone: tz, format: "|DD|" })),
        weekdayIndex: weekdayIndexInTz(todayStartTs, tz),
        weekdayShort: baseDate({ initial: todayStartTs, timezone: tz, format: "|aa|" }),
        weekdayLong: baseDate({ initial: todayStartTs, timezone: tz, format: "|AA|" }),
    };

    const monthStartForNames = thisMonthStartTs;
    const month = {
        ...makePoint({ timestamp: monthStartForNames, timezone: tz, defaultFormat, longFormat }),
        value: Number(baseDate({ initial: monthStartForNames, timezone: tz, format: "|MM|" })),
        short: baseDate({ initial: monthStartForNames, timezone: tz, format: "|oo|" }),
        long: baseDate({ initial: monthStartForNames, timezone: tz, format: "|OO|" }),
    };

    const yearStartForNums = thisYearStartTs;
    const year = {
        ...makePoint({ timestamp: yearStartForNums, timezone: tz, defaultFormat, longFormat }),
        value: Number(baseDate({ initial: yearStartForNums, timezone: tz, format: "|YYYY|" })),
        short: Number(baseDate({ initial: yearStartForNums, timezone: tz, format: "|YY|" })),
    };


    const tsTillEndOfDay = todayEndTs - nowTs;


    return {
        tsTillEndOfDay,
        getNow: getNowInTz,

        year,
        month,
        day,

        today: makePoint({ timestamp: todayStartTs, timezone: tz, defaultFormat, longFormat }),
        todayEnd: makePoint({ timestamp: todayEndTs, timezone: tz, defaultFormat, longFormat }),

        tomorrow: makePoint({
            timestamp: tomorrowStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        tomorrowEnd: makePoint({
            timestamp: tomorrowEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),

        yesterday: makePoint({
            timestamp: yesterdayStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        yesterdayEnd: makePoint({
            timestamp: yesterdayEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),

        nextWeekStart: makePoint({
            timestamp: nextWeekStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        nextWeekEnd: makePoint({
            timestamp: nextWeekEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        thisWeekStart: makePoint({
            timestamp: thisWeekStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        thisWeekEnd: makePoint({
            timestamp: thisWeekEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        lastWeekStart: makePoint({
            timestamp: lastWeekStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        lastWeekEnd: makePoint({
            timestamp: lastWeekEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),

        thisMonthStart: makePoint({
            timestamp: thisMonthStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        thisMonthEnd: makePoint({
            timestamp: thisMonthEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        nextMonthStart: makePoint({
            timestamp: nextMonthStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        nextMonthEnd: makePoint({
            timestamp: nextMonthEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        lastMonthStart: makePoint({
            timestamp: lastMonthStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        lastMonthEnd: makePoint({
            timestamp: lastMonthEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),

        thisYearStart: makePoint({
            timestamp: thisYearStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        thisYearEnd: makePoint({
            timestamp: thisYearEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        nextYearStart: makePoint({
            timestamp: nextYearStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        nextYearEnd: makePoint({
            timestamp: nextYearEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        lastYearStart: makePoint({
            timestamp: lastYearStartTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),
        lastYearEnd: makePoint({
            timestamp: lastYearEndTs,
            timezone: tz,
            defaultFormat,
            longFormat,
        }),

        last7Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 7,
            timezone: tz,
            defaultFormat,
        }),
        last15Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 15,
            timezone: tz,
            defaultFormat,
        }),
        last30Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 30,
            timezone: tz,
            defaultFormat,
        }),
        last45Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 45,
            timezone: tz,
            defaultFormat,
        }),
        last60Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 60,
            timezone: tz,
            defaultFormat,
        }),
        last90Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 90,
            timezone: tz,
            defaultFormat,
        }),
        last180Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 180,
            timezone: tz,
            defaultFormat,
        }),
    };
};

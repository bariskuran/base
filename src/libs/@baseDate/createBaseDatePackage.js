import { baseDate } from "../@baseDate";
import { baseStore } from "../@baseStore";

const getDefaults = () => {
    const { _baseDate } = baseStore?.globalData?.get?.() || {};
    const { defaultFormat, firstDayOfWeek, timeZone } = _baseDate || {};
    return { defaultFormat, firstDayOfWeek, timeZone };
};

const weekdayIndexInTz = (timestamp, timeZone) => {
    try {
        const name = new Intl.DateTimeFormat("en-US", {
            timeZone: typeof timeZone === "string" ? timeZone : undefined,
            weekday: "short",
        }).format(new Date(timestamp));
        const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        return map[name] ?? new Date(timestamp).getDay();
    } catch {
        return new Date(timestamp).getDay();
    }
};

const startOfDayTs = (nowTs, timeZone) => {
    const y = Number(baseDate({ initial: nowTs, timeZone, format: "|YYYY|" }));
    const m = Number(baseDate({ initial: nowTs, timeZone, format: "|MM|" }));
    const d = Number(baseDate({ initial: nowTs, timeZone, format: "|DD|" }));

    return baseDate({
        initial: { year: y, month: m, day: d, hour: 0, minute: 0, second: 0, millisecond: 0 },
        timeZone,
        format: "timestamp",
    });
};

const endOfDayTs = (dayStartTs, timeZone) => {
    const nextStart = baseDate({
        initial: dayStartTs,
        timeZone,
        calculate: { day: 1 },
        format: "timestamp",
    });
    return nextStart - 1;
};

const startOfMonthTs = (nowTs, timeZone) => {
    const y = Number(baseDate({ initial: nowTs, timeZone, format: "|YYYY|" }));
    const m = Number(baseDate({ initial: nowTs, timeZone, format: "|MM|" }));
    return baseDate({
        initial: { year: y, month: m, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
        timeZone,
        format: "timestamp",
    });
};

const startOfYearTs = (nowTs, timeZone) => {
    const y = Number(baseDate({ initial: nowTs, timeZone, format: "|YYYY|" }));
    return baseDate({
        initial: { year: y, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
        timeZone,
        format: "timestamp",
    });
};

const makePoint = ({ timestamp, timeZone, defaultFormat, longFormat }) => {
    const ts = Number(timestamp);

    return {
        timestamp: ts,
        defaultString: baseDate({ initial: ts, timeZone, format: defaultFormat }),
        longString: baseDate({ initial: ts, timeZone, format: longFormat }),
        calculate: (calculate, overrides = {}) =>
            baseDate({
                initial: ts,
                timeZone,
                calculate: calculate && typeof calculate === "object" ? calculate : undefined,
                ...overrides,
            }),
    };
};

const makeLastDaysRange = ({ endDayStartTs, daysBackInclusive, timeZone, defaultFormat }) => {
    const endTs = endOfDayTs(endDayStartTs, timeZone);

    const startTs = baseDate({
        initial: endDayStartTs,
        timeZone,
        calculate: { day: -(daysBackInclusive - 1) },
        format: "timestamp",
    });

    return {
        default: [
            baseDate({ initial: startTs, timeZone, format: defaultFormat }),
            baseDate({ initial: endTs, timeZone, format: defaultFormat }),
        ],
        timestamps: [startTs, endTs],
    };
};

export const createBaseDatePackage = (opts = {}) => {
    const { defaultFormat, firstDayOfWeek, timeZone: storeTz } = getDefaults();

    const tz =
        typeof opts.timeZone === "number" && Number.isFinite(opts.timeZone)
            ? opts.timeZone
            : typeof opts.timeZone === "string" && opts.timeZone.trim()
              ? opts.timeZone.trim()
              : storeTz;

    const longFormat = "|DD|/|MM|/|YYYY| |HH|:|NN|:|SS|";

    const nowTs = Date.now();

    const todayStartTs = startOfDayTs(nowTs, tz);
    const todayEndTs = endOfDayTs(todayStartTs, tz);

    const tomorrowStartTs = baseDate({
        initial: todayStartTs,
        timeZone: tz,
        calculate: { day: 1 },
        format: "timestamp",
    });
    const tomorrowEndTs = endOfDayTs(tomorrowStartTs, tz);

    const yesterdayStartTs = baseDate({
        initial: todayStartTs,
        timeZone: tz,
        calculate: { day: -1 },
        format: "timestamp",
    });
    const yesterdayEndTs = endOfDayTs(yesterdayStartTs, tz);

    // Week boundaries (based on firstDayOfWeek)
    const wd = weekdayIndexInTz(todayStartTs, tz);
    const deltaThisWeekStart = (wd - firstDayOfWeek + 7) % 7;

    const thisWeekStartTs = baseDate({
        initial: todayStartTs,
        timeZone: tz,
        calculate: { day: -deltaThisWeekStart },
        format: "timestamp",
    });

    const thisWeekEndTs = endOfDayTs(
        baseDate({
            initial: thisWeekStartTs,
            timeZone: tz,
            calculate: { day: 6 },
            format: "timestamp",
        }),
        tz,
    );

    const nextWeekStartTs = baseDate({
        initial: thisWeekStartTs,
        timeZone: tz,
        calculate: { day: 7 },
        format: "timestamp",
    });

    const nextWeekEndTs = endOfDayTs(
        baseDate({
            initial: nextWeekStartTs,
            timeZone: tz,
            calculate: { day: 6 },
            format: "timestamp",
        }),
        tz,
    );

    const lastWeekStartTs = baseDate({
        initial: thisWeekStartTs,
        timeZone: tz,
        calculate: { day: -7 },
        format: "timestamp",
    });

    const lastWeekEndTs = endOfDayTs(
        baseDate({
            initial: lastWeekStartTs,
            timeZone: tz,
            calculate: { day: 6 },
            format: "timestamp",
        }),
        tz,
    );

    // Month boundaries
    const thisMonthStartTs = startOfMonthTs(nowTs, tz);
    const nextMonthStartTs = baseDate({
        initial: thisMonthStartTs,
        timeZone: tz,
        calculate: { month: 1 },
        format: "timestamp",
    });
    const lastMonthStartTs = baseDate({
        initial: thisMonthStartTs,
        timeZone: tz,
        calculate: { month: -1 },
        format: "timestamp",
    });

    const thisMonthEndTs = nextMonthStartTs - 1;
    const nextMonthEndTs =
        baseDate({
            initial: nextMonthStartTs,
            timeZone: tz,
            calculate: { month: 1 },
            format: "timestamp",
        }) - 1;
    const lastMonthEndTs = thisMonthStartTs - 1;

    // Year boundaries
    const thisYearStartTs = startOfYearTs(nowTs, tz);
    const nextYearStartTs = baseDate({
        initial: thisYearStartTs,
        timeZone: tz,
        calculate: { year: 1 },
        format: "timestamp",
    });
    const lastYearStartTs = baseDate({
        initial: thisYearStartTs,
        timeZone: tz,
        calculate: { year: -1 },
        format: "timestamp",
    });

    const thisYearEndTs = nextYearStartTs - 1;
    const nextYearEndTs =
        baseDate({
            initial: nextYearStartTs,
            timeZone: tz,
            calculate: { year: 1 },
            format: "timestamp",
        }) - 1;
    const lastYearEndTs = thisYearStartTs - 1;

    // Core points
    const now = {
        ...makePoint({ timestamp: nowTs, timeZone: tz, defaultFormat, longFormat }),
        get: () => Date.now(),
    };

    const day = {
        ...makePoint({ timestamp: todayStartTs, timeZone: tz, defaultFormat, longFormat }),
        value: Number(baseDate({ initial: todayStartTs, timeZone: tz, format: "|DD|" })), // 31
        weekdayIndex: weekdayIndexInTz(todayStartTs, tz), // 6
        weekdayShort: baseDate({ initial: todayStartTs, timeZone: tz, format: "|aa|" }), // Sat
        weekdayLong: baseDate({ initial: todayStartTs, timeZone: tz, format: "|AA|" }), // Saturday
    };

    const monthStartForNames = thisMonthStartTs;
    const month = {
        ...makePoint({ timestamp: monthStartForNames, timeZone: tz, defaultFormat, longFormat }),
        value: Number(baseDate({ initial: monthStartForNames, timeZone: tz, format: "|MM|" })), // 1..12
        short: baseDate({ initial: monthStartForNames, timeZone: tz, format: "|oo|" }), // Jan
        long: baseDate({ initial: monthStartForNames, timeZone: tz, format: "|OO|" }), // January
    };

    const yearStartForNums = thisYearStartTs;
    const year = {
        ...makePoint({ timestamp: yearStartForNums, timeZone: tz, defaultFormat, longFormat }),
        value: Number(baseDate({ initial: yearStartForNums, timeZone: tz, format: "|YYYY|" })), // 2026
        short: Number(baseDate({ initial: yearStartForNums, timeZone: tz, format: "|YY|" })), // 26
    };

    // günün sonuna kadar kalan milisaniye
    const tsTillEndOfDay = todayEndTs - nowTs;

    // Output object
    return {
        tsTillEndOfDay,
        now,

        year,
        month,
        day,

        today: makePoint({ timestamp: todayStartTs, timeZone: tz, defaultFormat, longFormat }),
        todayEnd: makePoint({ timestamp: todayEndTs, timeZone: tz, defaultFormat, longFormat }),

        tomorrow: makePoint({
            timestamp: tomorrowStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        tomorrowEnd: makePoint({
            timestamp: tomorrowEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),

        yesterday: makePoint({
            timestamp: yesterdayStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        yesterdayEnd: makePoint({
            timestamp: yesterdayEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),

        nextWeekStart: makePoint({
            timestamp: nextWeekStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        nextWeekEnd: makePoint({
            timestamp: nextWeekEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        thisWeekStart: makePoint({
            timestamp: thisWeekStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        thisWeekEnd: makePoint({
            timestamp: thisWeekEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        lastWeekStart: makePoint({
            timestamp: lastWeekStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        lastWeekEnd: makePoint({
            timestamp: lastWeekEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),

        thisMonthStart: makePoint({
            timestamp: thisMonthStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        thisMonthEnd: makePoint({
            timestamp: thisMonthEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        nextMonthStart: makePoint({
            timestamp: nextMonthStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        nextMonthEnd: makePoint({
            timestamp: nextMonthEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        lastMonthStart: makePoint({
            timestamp: lastMonthStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        lastMonthEnd: makePoint({
            timestamp: lastMonthEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),

        thisYearStart: makePoint({
            timestamp: thisYearStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        thisYearEnd: makePoint({
            timestamp: thisYearEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        nextYearStart: makePoint({
            timestamp: nextYearStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        nextYearEnd: makePoint({
            timestamp: nextYearEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        lastYearStart: makePoint({
            timestamp: lastYearStartTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),
        lastYearEnd: makePoint({
            timestamp: lastYearEndTs,
            timeZone: tz,
            defaultFormat,
            longFormat,
        }),

        last7Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 7,
            timeZone: tz,
            defaultFormat,
        }),
        last15Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 15,
            timeZone: tz,
            defaultFormat,
        }),
        last30Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 30,
            timeZone: tz,
            defaultFormat,
        }),
        last45Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 45,
            timeZone: tz,
            defaultFormat,
        }),
        last60Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 60,
            timeZone: tz,
            defaultFormat,
        }),
        last90Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 90,
            timeZone: tz,
            defaultFormat,
        }),
        last180Days: makeLastDaysRange({
            endDayStartTs: todayStartTs,
            daysBackInclusive: 180,
            timeZone: tz,
            defaultFormat,
        }),
    };
};

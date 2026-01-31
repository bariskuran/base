import { DATE_DEFAULTS } from "../../constants/DATE_DEFAULTS";
import { baseStore } from "../@baseStore";

const parseOffsetMinutes = (tz) => {
    if (typeof tz === "number" && Number.isFinite(tz)) return Math.trunc(tz * 60);

    if (typeof tz !== "string") return null;

    const s = tz.trim();
    if (!s) return null;

    const m = s.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
    if (!m) return null;

    const sign = m[1] === "-" ? -1 : 1;
    const hh = Number(m[2] || 0);
    const mm = Number(m[3] || 0);

    if (hh > 23 || mm > 59) return null;
    return sign * (hh * 60 + mm);
};

const getPartsForOffset = (date, offsetMinutes) => {
    const shifted = new Date(date.getTime() + offsetMinutes * 60_000);

    const pad2 = (n) => String(n).padStart(2, "0");

    return {
        year: String(shifted.getUTCFullYear()),
        month: pad2(shifted.getUTCMonth() + 1),
        day: pad2(shifted.getUTCDate()),
        hour: pad2(shifted.getUTCHours()),
        minute: pad2(shifted.getUTCMinutes()),
        second: pad2(shifted.getUTCSeconds()),
        millisecond: String(shifted.getUTCMilliseconds()).padStart(3, "0"),
    };
};

const safeIntlParts = (date, timeZone) => {
    if (!timeZone || typeof Intl === "undefined" || !Intl.DateTimeFormat) return null;
    try {
        const dtf = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            weekday: "long",
        });
        const parts = dtf.formatToParts(date);
        const out = {};
        for (const p of parts) {
            if (p.type === "year") out.year = Number(p.value);
            if (p.type === "month") out.month = Number(p.value);
            if (p.type === "day") out.day = Number(p.value);
            if (p.type === "hour") out.hour = Number(p.value);
            if (p.type === "minute") out.minute = Number(p.value);
            if (p.type === "second") out.second = Number(p.value);
            if (p.type === "weekday") out.weekdayLong = p.value;
        }
        return out;
    } catch {
        return null;
    }
};

const getTzOffsetMinutesForInstant = (timeZone, dateUTC) => {
    const parts = safeIntlParts(dateUTC, timeZone);
    if (!parts) return 0;

    const asUTC = Date.UTC(
        parts.year,
        (parts.month || 1) - 1,
        parts.day || 1,
        parts.hour || 0,
        parts.minute || 0,
        parts.second || 0,
        0,
    );

    return Math.round((asUTC - dateUTC.getTime()) / 60000);
};

const makeDateFromPartsInTz = (parts, timeZone) => {
    const y = Number.isFinite(parts.year) ? parts.year : DATE_DEFAULTS.year;
    const m = Number.isFinite(parts.month) ? parts.month : DATE_DEFAULTS.month;
    const d = Number.isFinite(parts.day) ? parts.day : DATE_DEFAULTS.day;

    const hh = Number.isFinite(parts.hour) ? parts.hour : 0;
    const nn = Number.isFinite(parts.minute) ? parts.minute : 0;
    const ss = Number.isFinite(parts.second) ? parts.second : 0;
    const ms = Number.isFinite(parts.millisecond) ? parts.millisecond : 0;

    const utcGuess = new Date(Date.UTC(y, (m || 1) - 1, d || 1, hh, nn, ss, ms));

    const offsetStr = parseOffsetMinutes(timeZone);
    if (typeof offsetStr === "number") {
        return new Date(utcGuess.getTime() - offsetStr * 60000);
    }

    if (timeZone && typeof timeZone === "string") {
        const off = getTzOffsetMinutesForInstant(timeZone, utcGuess);
        return new Date(utcGuess.getTime() - off * 60000);
    }

    return new Date(y, (m || 1) - 1, d || 1, hh, nn, ss, ms);
};

const parseInitialString = (str) => {
    const s = String(str || "").trim();
    if (!s) return null;

    /* eslint-disable no-useless-escape */
    const m = s.match(
        /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})(?:\s+(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?)?$/,
    );
    /* eslint-enable no-useless-escape */

    if (m) {
        let day = Number(m[1]);
        let month = Number(m[2]);
        let year = Number(m[3]);
        if (String(m[3]).length === 2) year = 2000 + year;

        const hour = m[4] != null ? Number(m[4]) : 0;
        const minute = m[5] != null ? Number(m[5]) : 0;
        const second = m[6] != null ? Number(m[6]) : 0;

        return { year, month, day, hour, minute, second, millisecond: 0 };
    }

    const dt = new Date(s);
    if (!Number.isNaN(dt.getTime())) return dt;

    return null;
};

const pad = (n, len = 2) => String(Math.trunc(n)).padStart(len, "0");

const formatWithTokens = (date, format, timeZone) => {
    const fmt = String(format || "");
    const offsetMinutes = parseOffsetMinutes(timeZone);

    const has24h = fmt.includes("HH") || fmt.includes("hh");
    const has12h = fmt.includes("ZZ") || fmt.includes("zz");
    const useAmPm = has12h && !has24h;

    let year, month, day, hour24, minute, second, ms;
    let weekdayLong, weekdayShort, monthLong, monthShort;

    if (typeof offsetMinutes === "number") {
        const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
        const parts = getPartsForOffset(date, offsetMinutes);

        year = Number(parts.year);
        month = Number(parts.month);
        day = Number(parts.day);
        hour24 = Number(parts.hour);
        minute = Number(parts.minute);
        second = Number(parts.second);
        ms = Number(parts.millisecond ?? shifted.getUTCMilliseconds());

        const safeFmt = (opt) => {
            try {
                return new Intl.DateTimeFormat("default", { timeZone: "UTC", ...opt }).format(
                    shifted,
                );
            } catch {
                return "";
            }
        };

        weekdayLong = safeFmt({ weekday: "long" }) || shifted.toUTCString().split(",")[0] || "";
        weekdayShort = safeFmt({ weekday: "short" }) || "";
        monthLong = safeFmt({ month: "long" }) || "";
        monthShort = safeFmt({ month: "short" }) || "";
    } else {
        const p = safeIntlParts(date, timeZone);

        year = p?.year ?? date.getFullYear();
        month = p?.month ?? date.getMonth() + 1;
        day = p?.day ?? date.getDate();
        hour24 = p?.hour ?? date.getHours();
        minute = p?.minute ?? date.getMinutes();
        second = p?.second ?? date.getSeconds();
        ms = date.getMilliseconds();

        weekdayLong = p?.weekdayLong ?? date.toLocaleDateString("default", { weekday: "long" });

        weekdayShort =
            typeof Intl !== "undefined"
                ? (() => {
                      try {
                          return new Intl.DateTimeFormat("default", {
                              timeZone: timeZone || undefined,
                              weekday: "short",
                          }).format(date);
                      } catch {
                          return date.toLocaleDateString("default", { weekday: "short" });
                      }
                  })()
                : date.toLocaleDateString("default", { weekday: "short" });

        monthLong =
            typeof Intl !== "undefined"
                ? (() => {
                      try {
                          return new Intl.DateTimeFormat("default", {
                              timeZone: timeZone || undefined,
                              month: "long",
                          }).format(date);
                      } catch {
                          return date.toLocaleString("default", { month: "long" });
                      }
                  })()
                : date.toLocaleString("default", { month: "long" });

        monthShort =
            typeof Intl !== "undefined"
                ? (() => {
                      try {
                          return new Intl.DateTimeFormat("default", {
                              timeZone: timeZone || undefined,
                              month: "short",
                          }).format(date);
                      } catch {
                          return date.toLocaleString("default", { month: "short" });
                      }
                  })()
                : date.toLocaleString("default", { month: "short" });
    }

    const hour12 = hour24 % 12 || 12;

    const map = {
        YYYY: () => pad(year, 4),
        YY: () => pad(year % 100, 2),

        MM: () => pad(month, 2),
        mm: () => String(month),

        OO: () => monthLong,
        oo: () => monthShort,

        DD: () => pad(day, 2),
        dd: () => String(day),

        AA: () => weekdayLong,
        aa: () => weekdayShort,

        HH: () => pad(hour24, 2),
        hh: () => String(hour24),

        ZZ: () => pad(hour12, 2),
        zz: () => String(hour12),

        AP: () => (useAmPm ? (hour24 >= 12 ? "PM" : "AM") : ""),
        ap: () => (useAmPm ? (hour24 >= 12 ? "pm" : "am") : ""),

        NN: () => pad(minute, 2),
        nn: () => String(minute),

        SS: () => pad(second, 2),
        ss: () => String(second),

        LL: () => pad(ms, 3),
        ll: () => String(ms),
    };

    const TOKENS = Object.keys(map).sort((a, b) => b.length - a.length);

    const hasDelimited = /\|[A-Za-z]{2,4}\|/.test(fmt);

    if (hasDelimited) {
        return fmt.replace(/\|([A-Za-z]{2,4})\|/g, (full, token) => {
            const fn = map[token];
            return fn ? String(fn()) : full;
        });
    }

    let out = fmt;
    for (const t of TOKENS) {
        if (!out.includes(t)) continue;
        out = out.split(t).join(String(map[t]()));
    }
    return out;
};

const resolveDefaultsFromStore = () => {
    const gd = baseStore?.globalData?.get?.() || {};
    const cd = baseStore?.clientData?.get?.() || {};
    const bs = gd.baseDateSettings || {};
    const defaultFormat =
        typeof bs.defaultFormat === "string" && bs.defaultFormat
            ? bs.defaultFormat
            : DATE_DEFAULTS.defaultFormat;

    const firstDayOfWeek = typeof bs.firstDayOfWeek === "number" ? bs.firstDayOfWeek : 1;

    const timeZone = typeof cd.timeZone === "string" && cd.timeZone ? cd.timeZone : undefined;

    return { defaultFormat, firstDayOfWeek, timeZone };
};

/**
 * Creates a Date (or timestamp) from multiple input shapes, with flexible formatting.
 *
 * Supported `initial` inputs:
 * - `undefined | null | ""`  -> uses "now"
 * - `number`                 -> timestamp (ms)
 * - `string`                 -> "|DD|/|MM|/|YYYY|" or "|DD|/|MM|/|YYYY| |HH|:|NN|" or "|DD|/|MM|/|YYYY| |HH|:|NN|:|SS|"
 *                              Also accepts separators `/`, `.`, `-` (e.g. "28-03-1982")
 * - `object`                 -> { year, month, day, hour, minute, second, millisecond }
 *                              Missing fields fall back to defaults.
 *
 * Output:
 * - returns formatted string by default
 * - if `returnTimeStamp: true` -> returns number (timestamp, ms)
 *
 * Format:
 * - If `format` is not provided, it tries `baseStore.globalData.get().baseDateSettings.defaultFormat`
 * - If still missing, defaults to `"DD/MM/YYYY"`
 * - Format tokens are free-form and can be mixed with any text:
 *   e.g. "DD gününde MM ayında YYYY yılında, saat HH:NN"
 *
 * Locale/timezone:
 * - `timeZone` defaults to user timezone from `baseStore.clientData.get().timeZone` if available,
 *   otherwise uses environment local timezone.
 * - `timeZone` may be IANA name like "Europe/Athens" or an offset like "+2", "-05:30".
 *
 * Week:
 * - `firstDayOfWeek` is read from `baseStore.globalData.get().baseDateSettings.firstDayOfWeek`
 *   (defaults to Monday = 1 if missing)
 *
 * @param {Object} [settings]
 * @param {undefined|null|string|number|Object} [settings.initial]
 * @param {boolean} [settings.returnTimeStamp=false]
 * @param {string} [settings.format]
 * @param {string|number} [settings.timeZone]
 *
 * @returns {string|number}
 *
 * @example
 * // 1) Empty initial -> now, default format from baseStore (or "DD/MM/YYYY")
 * const today = baseDate({});
 * // "31/01/2026"  (example output)
 *
 * @example
 * // 2) Timestamp input
 * const ts = 1700000000000;
 * baseDate({ initial: ts, format: "|DD|/|MM|/|YYYY| |HH|:|NN|:|SS|" });
 * // "14/11/2023 22:13:20" (example output, depends on timezone)
 *
 * @example
 * // 3) String input (DD/MM/YYYY)
 * baseDate({ initial: "28/03/1982" });
 * // "28/03/1982"
 *
 * @example
 * // 4) String input with time (DD/MM/YYYY HH:MM)
 * baseDate({ initial: "28/03/1982 09:15", format: "|DD|/|MM|/|YYYY| |HH|:|NN|" });
 * // "28.03.1982 09:15"
 *
 * @example
 * // 5) String input accepts different separators: "/", "-", "."
 * baseDate({ initial: "28-03-1982", format: "|DD|-|MM|-|YYYY|" });
 * // "28-03-1982"
 *
 * @example
 * // 6) Object input (month is 1-12)
 * baseDate({
 *   initial: { year: 2024, month: 12, day: 5, hour: 8, minute: 3 },
 *   format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
 * });
 * // "05/12/2024 08:03"
 *
 * @example
 * // 7) Object input with missing fields uses defaults:
 * // year=1982, month=3, day=28, time=00:00:00.000
 * baseDate({ initial: { hour: 12 }, format: "|DD|/|MM|/|YYYY| |HH|:|NN|:|SS|" });
 * // "28/03/1982 12:00:00"
 *
 * @example
 * // 8) Free-form format text
 * baseDate({
 *   initial: "01/02/2026 17:45",
 *   format: "|DD| gününde |MM| ayında |YYYY| yılında, saat |HH|:|NN|",
 * });
 * // "01 gününde 02 ayında 2026 yılında, saat 17:45"
 *
 * @example
 * // 9) Return timestamp (ignores format)
 * const stamp = baseDate({ initial: "28/03/1982 09:15", returnTimeStamp: true });
 * // 386582100000  (example)
 *
 * @example
 * // 10) Use IANA timezone (e.g. Greece)
 * baseDate({
 *   initial: "28/03/1982 09:15",
 *   timeZone: "Europe/Athens",
 *   format: "|DD|/|MM|/|YYYY| |HH|:|NN| |AP|",
 * });
 * // "28/03/1982 09:15 AM"
 *
 * @example
 * // 11) Use numeric offset timezone
 * baseDate({
 *   initial: "28/03/1982 09:15",
 *   timeZone: "+02:00",
 *   format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
 * });
 * // "28/03/1982 09:15"
 */
export const baseDate = (opts = {}) => {
    const { defaultFormat, timeZone: storeTz } = resolveDefaultsFromStore();

    const { initial, returnTimeStamp = false, format, timeZone } = opts || {};

    const tz =
        typeof timeZone === "number" && Number.isFinite(timeZone)
            ? timeZone
            : typeof timeZone === "string" && timeZone.trim()
              ? timeZone.trim()
              : storeTz;

    let dateObj = null;

    if (initial == null || initial === "") {
        dateObj = new Date();
    } else if (initial instanceof Date) {
        dateObj = new Date(initial.getTime());
    } else if (typeof initial === "number" && Number.isFinite(initial)) {
        dateObj = new Date(initial);
    } else if (typeof initial === "string") {
        const parsed = parseInitialString(initial);
        if (parsed instanceof Date) {
            dateObj = parsed;
        } else if (parsed && typeof parsed === "object") {
            dateObj = makeDateFromPartsInTz(parsed, tz);
        } else {
            dateObj = new Date();
        }
    } else if (typeof initial === "object") {
        const parts = {
            year: initial.year ?? DATE_DEFAULTS.year,
            month: initial.month ?? DATE_DEFAULTS.month,
            day: initial.day ?? DATE_DEFAULTS.day,
            hour: initial.hour ?? 0,
            minute: initial.minute ?? 0,
            second: initial.second ?? 0,
            millisecond: initial.millisecond ?? 0,
        };
        dateObj = makeDateFromPartsInTz(parts, tz);
    } else {
        dateObj = new Date();
    }

    if (!dateObj || Number.isNaN(dateObj.getTime())) dateObj = new Date();

    if (returnTimeStamp) return dateObj.getTime();

    const fmt = typeof format === "string" && format ? format : defaultFormat;

    return formatWithTokens(dateObj, fmt, tz);
};

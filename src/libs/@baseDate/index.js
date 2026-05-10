import { DATE_DEFAULTS } from "../../constants/DATE_DEFAULTS";
import {
    resolveDefaultsFromStore,
    parseInitialString,
    makeDateFromPartsInTz,
    parseOffsetMinutes,
    getPartsForOffset,
    safeIntlParts,
    formatWithTokens,
} from "./tools";

/**
 * Creates a Date (or timestamp) from multiple input shapes, with flexible formatting.
 *
 * Supported `initial` inputs:
 * - `undefined | null | ""`  -> uses "now"
 * - `number`                 -> timestamp (ms)
 * - `string`                 -> parsed with `initialFormat` (or `defaultFormat` if missing)
 *                              Token mapping is same as output format (e.g. "|DD|/|MM|/|YYYY| |HH|:|NN|")
 *                              If parse fails, falls back to `new Date(initial)`.
 * - `object`                 -> { year, month, day, hour, minute, second, millisecond }
 *                              Missing fields fall back to defaults.
 *
 * Output:
 * - returns formatted string by default
 * - if `format: "timestamp"` (case-insensitive) -> returns number (timestamp, ms)
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
 * @param {string} [settings.format]
 * @param {string} [settings.initialFormat] - Input parser format; defaults to `defaultFormat`.
 * @param {string|number} [settings.timeZone]
 * @param {Object} [settings.calculate]
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
 * // 9) Return timestamp
 * const stamp = baseDate({ initial: "28/03/1982 09:15", format: "timestamp" });
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
 *
 * @example
 * // Add 5 days
 * baseDate({
 *   initial: "10/03/2024",
 *   calculate: { day: 5 },
 *   format: "|DD|/|MM|/|YYYY|",
 * });
 * // "15/03/2024"
 *
 * @example
 * // Subtract 10 days (crossing month boundary)
 * baseDate({
 *   initial: "05/03/2024",
 *   calculate: { day: -10 },
 *   format: "|DD|/|MM|/|YYYY|",
 * });
 * // "24/02/2024"
 *
 * @example
 * // Subtract 1 month from May 31
 * baseDate({
 *   initial: "31/05/2024",
 *   calculate: { month: -1 },
 *   format: "|DD|/|MM|/|YYYY|",
 * });
 * // "30/04/2024"
 *
 * @example
 * // Subtract 1 month from March 31 (leap year aware)
 * baseDate({
 *   initial: "31/03/2024",
 *   calculate: { month: -1 },
 *   format: "|DD|/|MM|/|YYYY|",
 * });
 * // "29/02/2024"
 *
 * @example
 * // Subtract 1 month from March 31 (non-leap year)
 * baseDate({
 *   initial: "31/03/2023",
 *   calculate: { month: -1 },
 *   format: "|DD|/|MM|/|YYYY|",
 * });
 * // "28/02/2023"
 *
 * @example
 * // Add 1 year to Feb 29 (leap year normalization)
 * baseDate({
 *   initial: "29/02/2024",
 *   calculate: { year: 1 },
 *   format: "|DD|/|MM|/|YYYY|",
 * });
 * // "28/02/2025"
 *
 * @example
 * // Add 6 hours
 * baseDate({
 *   initial: "01/04/2024 10:30",
 *   calculate: { hour: 6 },
 *   format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
 * });
 * // "01/04/2024 16:30"
 *
 * @example
 * // Subtract 20 minutes (crossing hour boundary)
 * baseDate({
 *   initial: "01/04/2024 10:10",
 *   calculate: { minute: -20 },
 *   format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
 * });
 * // "01/04/2024 09:50"
 *
 * @example
 * // Subtract 5000 seconds (~1h 23m 20s)
 * baseDate({
 *   initial: "01/04/2024 12:00:00",
 *   calculate: { seconds: -5000 },
 *   format: "|DD|/|MM|/|YYYY| |HH|:|NN|:|SS|",
 * });
 * // "01/04/2024 10:36:40"
 *
 * @example
 * // Complex calculation
 * baseDate({
 *   initial: "31/12/2023 23:30",
 *   calculate: {
 *     year: 1,
 *     month: -1,
 *     day: 2,
 *     hour: 1,
 *     minute: -45,
 *   },
 *   format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
 * });
 * // "02/12/2024 23:45"
 *
 * @example
 * // Invalid calculate input is ignored
 * baseDate({
 *   initial: "10/03/2024",
 *   calculate: "invalid",
 *   format: "|DD|/|MM|/|YYYY|",
 * });
 * // "10/03/2024"
 *
 *
 */
export const baseDate = (opts = {}) => {
    const { defaultFormat, timeZone: storeTz } = resolveDefaultsFromStore();

    const { initial, format, initialFormat, timeZone, calculate } = opts || {};

    const tz =
        typeof timeZone === "number" && Number.isFinite(timeZone)
            ? timeZone
            : typeof timeZone === "string" && timeZone.trim()
              ? timeZone.trim()
              : storeTz;
    const initFmt =
        typeof initialFormat === "string" && initialFormat.trim()
            ? initialFormat.trim()
            : defaultFormat;

    let dateObj = null;

    if (initial == null || initial === "") {
        dateObj = new Date();
    } else if (initial instanceof Date) {
        dateObj = new Date(initial.getTime());
    } else if (typeof initial === "number" && Number.isFinite(initial)) {
        dateObj = new Date(initial);
    } else if (typeof initial === "string") {
        const parsed = parseInitialString(initial, initFmt);
        if (parsed && typeof parsed === "object") {
            dateObj = makeDateFromPartsInTz(parsed, tz);
        } else {
            const dt = new Date(initial);
            dateObj = Number.isNaN(dt.getTime()) ? new Date() : dt;
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

    const calc = calculate && typeof calculate === "object" ? calculate : null;

    if (calc) {
        const toInt = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : 0);

        const addYears = toInt(calc.year);
        const addMonths = toInt(calc.month);
        const addDays = toInt(calc.day);

        const addHours = toInt(calc.hour);
        const addMinutes = toInt(calc.minute);
        const addSeconds = toInt(calc.second) + toInt(calc.seconds);
        const addMs = toInt(calc.millisecond);

        const getTzParts = (d, tzValue) => {
            const off = parseOffsetMinutes(tzValue);
            if (typeof off === "number") {
                const p = getPartsForOffset(d, off);
                return {
                    year: Number(p.year),
                    month: Number(p.month),
                    day: Number(p.day),
                    hour: Number(p.hour),
                    minute: Number(p.minute),
                    second: Number(p.second),
                    millisecond: Number(p.millisecond ?? 0),
                };
            }
            const p = safeIntlParts(d, tzValue);
            return {
                year: p?.year ?? d.getFullYear(),
                month: p?.month ?? d.getMonth() + 1,
                day: p?.day ?? d.getDate(),
                hour: p?.hour ?? d.getHours(),
                minute: p?.minute ?? d.getMinutes(),
                second: p?.second ?? d.getSeconds(),
                millisecond: d.getMilliseconds(),
            };
        };

        const daysInMonth = (y, m1to12) => {
            const mm = Math.max(1, Math.min(12, m1to12));
            return new Date(Date.UTC(y, mm, 0)).getUTCDate();
        };

        const normalizeYearMonth = (y, m1to12) => {
            let year = y;
            let month = m1to12;
            if (!Number.isFinite(year)) year = DATE_DEFAULTS.year;
            if (!Number.isFinite(month)) month = DATE_DEFAULTS.month;

            month -= 1;
            year += Math.floor(month / 12);
            month = ((month % 12) + 12) % 12;
            month += 1;

            return { year, month };
        };

        const parts0 = getTzParts(dateObj, tz);

        let y = parts0.year;
        let m = parts0.month;
        let d = parts0.day;

        const hh = parts0.hour;
        const nn = parts0.minute;
        const ss = parts0.second;
        const ms = parts0.millisecond;

        if (addYears || addMonths) {
            const nm = normalizeYearMonth(y + addYears, m + addMonths);
            y = nm.year;
            m = nm.month;

            const dim = daysInMonth(y, m);
            d = Math.min(d, dim);
        }

        if (addDays) {
            const tmp = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + addDays, hh, nn, ss, ms));
            y = tmp.getUTCFullYear();
            m = tmp.getUTCMonth() + 1;
            d = tmp.getUTCDate();
        }

        if (addYears || addMonths || addDays) {
            dateObj = makeDateFromPartsInTz(
                { year: y, month: m, day: d, hour: hh, minute: nn, second: ss, millisecond: ms },
                tz,
            );
        }

        const durationMs = addMs + addSeconds * 1000 + addMinutes * 60_000 + addHours * 3_600_000;

        if (durationMs) {
            dateObj = new Date(dateObj.getTime() + durationMs);
        }
    }

    const fmt = typeof format === "string" && format ? format : defaultFormat;
    if (typeof fmt === "string" && fmt.trim().toLowerCase() === "timestamp") {
        return dateObj.getTime();
    }
    return formatWithTokens(dateObj, fmt, tz);
};

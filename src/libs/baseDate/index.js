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

const calcFirstInt = (obj, keys) => {
    if (!obj || typeof obj !== "object") return 0;
    for (const k of keys) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        const v = obj[k];
        if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
    }
    return 0;
};

const calcSumInts = (obj, keys) => {
    if (!obj || typeof obj !== "object") return 0;
    let t = 0;
    for (const k of keys) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        const v = obj[k];
        if (typeof v === "number" && Number.isFinite(v)) t += Math.trunc(v);
    }
    return t;
};

const isCalcObject = (v) =>
    v != null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date);

const CALC_YEAR = ["year", "years", "y"];
const CALC_MONTH = ["month", "months", "m"];
const CALC_DAY = ["day", "days", "d"];
const CALC_HOUR = ["hour", "hours", "h"];
const CALC_MINUTE = ["minute", "minutes", "min"];
const CALC_SECONDS = ["second", "sec", "s", "seconds", "secs"];
const CALC_MS = ["millisecond", "milliseconds", "milisecond", "ms"];

export const baseDate = (opts = {}) => {
    const { defaultFormat, timezone: storeTz } = resolveDefaultsFromStore();

    const { initial, format, initialFormat, timezone, calc } = opts || {};

    const tz =
        typeof timezone === "number" && Number.isFinite(timezone)
            ? timezone
            : typeof timezone === "string" && timezone.trim()
              ? timezone.trim()
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

    const calcOpts = isCalcObject(calc) ? calc : null;

    if (calcOpts) {

        const addYears = calcFirstInt(calcOpts, CALC_YEAR);
        const addMonths = calcFirstInt(calcOpts, CALC_MONTH);
        const addDays = calcFirstInt(calcOpts, CALC_DAY);

        const addHours = calcFirstInt(calcOpts, CALC_HOUR);
        const addMinutes = calcFirstInt(calcOpts, CALC_MINUTE);
        const addSeconds = calcSumInts(calcOpts, CALC_SECONDS);
        const addMs = calcSumInts(calcOpts, CALC_MS);

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

export const getNow = (opts = {}) => {
    const { format, timezone } = opts || {};
    return baseDate({ format, timezone });
};

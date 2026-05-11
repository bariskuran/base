import { baseDate } from "../@baseDate";

/** Only treat strings as raw ms timestamps when they are purely numeric (avoids `parseFloat("31/01/2026") === 31`). */
const looksLikeNumericTimestampString = (s) => /^-?\d+(\.\d+)?$/.test(s);

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
/** Average Gregorian year length (accounts for leap years). */
const YEAR = 365.25 * DAY;

const omitZeroNumericProps = (obj) => {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "number" && Number.isFinite(v) && v !== 0) out[k] = v;
    }
    return out;
};

/** Half-up at `decimals` (e.g. 0.134→0.13, 0.135→0.14). */
const roundHalfUpDecimals = (x, decimals) => {
    if (!Number.isFinite(x)) return x;
    const p = 10 ** decimals;
    const sign = x < 0 ? -1 : 1;
    const ax = Math.abs(x);
    return sign * (Math.round(ax * p) / p);
};

/** True when the first digit after “.” is `0` (e.g. 0.0134); false for 0.134. */
const firstFractionalDigitIsZero = (ax) => {
    const s = ax.toFixed(18).replace(/\.?0+$/, "");
    const parts = s.split(".");
    if (parts.length < 2) return false;
    return parts[1][0] === "0";
};

/** `n` meaningful digits in the mantissa (leading fractional zeros skipped), e.g. 0.0000012 → 2 digits. */
const roundSignificantDigits = (x, n) => {
    if (!Number.isFinite(x) || x === 0) return x;
    const sign = x < 0 ? -1 : 1;
    const ax = Math.abs(x);
    const p = 10 ** (n - Math.ceil(Math.log10(ax)));
    return sign * (Math.round(ax * p) / p);
};

/** Fixed decimals when |x|≥1 or when 0<|x|<1 but first fractional digit ≠ 0 (half-up). */
const IN_FIXED_DECIMALS = 2;

/** Display rounding for each `in` field (see DS). */
const roundInField = (key, raw) => {
    if (key === "inMilliseconds") {
        return Math.round(raw);
    }
    const ax = Math.abs(raw);
    if (!Number.isFinite(ax) || ax === 0) {
        return raw;
    }

    if (ax >= 1) {
        return roundHalfUpDecimals(raw, IN_FIXED_DECIMALS);
    }

    if (!firstFractionalDigitIsZero(ax)) {
        return roundHalfUpDecimals(raw, IN_FIXED_DECIMALS);
    }

    return roundSignificantDigits(raw, 2);
};

const buildIn = (absMs) => {
    const raw = {
        inYears: absMs / YEAR,
        inDays: absMs / DAY,
        inHours: absMs / HOUR,
        inMinutes: absMs / MINUTE,
        inSeconds: absMs / SECOND,
        inMilliseconds: absMs,
    };
    const out = {};
    for (const [key, val] of Object.entries(raw)) {
        out[key] = roundInField(key, val);
    }
    return out;
};

const timelineRel = (selfTs, otherTs) => {
    if (selfTs < otherTs) return "inPast";
    if (selfTs > otherTs) return "inFuture";
    return "sameInstant";
};

/**
 * Resolves an argument to `{ ts, dateObj, dateStr }`.
 * Plain objects use `baseDate`: resolution forces `format: "timestamp"`.
 * Optional `format` on the object is only used for the returned `date` string.
 *
 * @param {number | string | Date | Object} arg
 */
const resolveSide = (arg) => {
    if (arg instanceof Date) {
        const ts = arg.getTime();
        if (!Number.isFinite(ts)) throw new Error("getTimeDiff: invalid Date");
        const dateObj = arg;
        const date = baseDate({ initial: ts });
        return { ts, dateObj, date };
    }

    if (typeof arg === "string") {
        const s = arg.trim();
        if (s === "") throw new Error("getTimeDiff: empty string");

        if (looksLikeNumericTimestampString(s)) {
            const n = Number(s);
            if (!Number.isFinite(n)) throw new Error("getTimeDiff: invalid numeric string");
            const dateObj = new Date(n);
            const date = baseDate({ initial: n });
            return { ts: n, dateObj, date };
        }

        return resolveSide({ initial: s });
    }

    if (typeof arg === "number") {
        if (!Number.isFinite(arg)) throw new Error("getTimeDiff: invalid number");
        const dateObj = new Date(arg);
        const date = baseDate({ initial: arg });
        return { ts: arg, dateObj, date };
    }

    if (arg && typeof arg === "object") {
        const opts = { ...arg };
        const displayFormat =
            typeof opts.format === "string" && opts.format.trim() ? opts.format.trim() : null;
        delete opts.format;

        const tsVal = baseDate({ ...opts, format: "timestamp" });
        const ts = typeof tsVal === "number" ? tsVal : Number(tsVal);
        if (!Number.isFinite(ts)) throw new Error("getTimeDiff: could not resolve timestamp");

        const dateObj = new Date(ts);
        const date = displayFormat
            ? baseDate({ ...opts, format: displayFormat })
            : Object.keys(opts).length === 0
              ? baseDate({ initial: ts })
              : baseDate(opts);

        return { ts, dateObj, date };
    }

    throw new Error("getTimeDiff: unsupported input type");
};

const addYearsUTC = (ts, deltaYears) => {
    const d = new Date(ts);
    d.setUTCFullYear(d.getUTCFullYear() + deltaYears);
    return d.getTime();
};

/**
 * Calendar month step (handles Jan 31 → Feb last day, etc.).
 */
const addMonthsUTC = (ts, deltaMonths) => {
    const d = new Date(ts);
    const day = d.getUTCDate();
    d.setUTCMonth(d.getUTCMonth() + deltaMonths);
    if (d.getUTCDate() < day) {
        d.setUTCDate(0);
    }
    return d.getTime();
};

const addDaysUTC = (ts, deltaDays) => {
    const d = new Date(ts);
    d.setUTCDate(d.getUTCDate() + deltaDays);
    return d.getTime();
};

/**
 * Walk from `minTs` to `maxTs` in UTC calendar order: full years, then months (0–11 count),
 * then days within month, then clock units. Does not use fixed 24h “days” from raw ms.
 */
const breakdownCalendarUTC = (minTs, maxTs) => {
    const endTime = maxTs;
    let cursor = minTs;

    let year = 0;
    while (true) {
        const next = addYearsUTC(cursor, 1);
        if (next > endTime) break;
        cursor = next;
        year++;
    }

    let month = 0;
    while (true) {
        const next = addMonthsUTC(cursor, 1);
        if (next > endTime) break;
        cursor = next;
        month++;
    }

    let day = 0;
    while (true) {
        const next = addDaysUTC(cursor, 1);
        if (next > endTime) break;
        cursor = next;
        day++;
    }

    let hour = 0;
    while (true) {
        const next = cursor + HOUR;
        if (next > endTime) break;
        cursor = next;
        hour++;
    }

    let minute = 0;
    while (true) {
        const next = cursor + MINUTE;
        if (next > endTime) break;
        cursor = next;
        minute++;
    }

    let second = 0;
    while (true) {
        const next = cursor + SECOND;
        if (next > endTime) break;
        cursor = next;
        second++;
    }

    const millisecond = endTime - cursor;

    return { year, month, day, hour, minute, second, millisecond };
};

/**
 * Millisecond difference and duration views between two instants.
 * `tsDiff` is always non-negative; order is expressed via `time1.atTimeline` / `time2.atTimeline`.
 *
 * @param {number | string | Date | Object} time1
 * @param {number | string | Date | Object} [time2] — omitted → compared to “now” via empty
 *   `baseDate` options (`resolveSide({})`: same instant as `baseDate({ format: "timestamp" })`,
 *   display string matches `baseDate({})`).
 */
export const getTimeDiff = (time1, time2) => {
    const r1 = resolveSide(time1);
    const r2 = time2 === undefined ? resolveSide({}) : resolveSide(time2);

    const absMs = Math.abs(r2.ts - r1.ts);

    const lo = Math.min(r1.ts, r2.ts);
    const hi = Math.max(r1.ts, r2.ts);
    const br = breakdownCalendarUTC(lo, hi);

    return {
        time1: {
            ts: r1.ts,
            dateObj: r1.dateObj,
            date: r1.date,
            atTimeline: timelineRel(r1.ts, r2.ts),
        },
        time2: {
            ts: r2.ts,
            dateObj: r2.dateObj,
            date: r2.date,
            atTimeline: timelineRel(r2.ts, r1.ts),
        },
        tsDiff: absMs,
        in: omitZeroNumericProps(buildIn(absMs)),
        breakdown: omitZeroNumericProps(br),
    };
};

import { baseStore } from "../@baseStore";
import { DATE_DEFAULTS } from "../../constants/DATE_DEFAULTS";

export const parseOffsetMinutes = (tz) => {
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

export const getPartsForOffset = (date, offsetMinutes) => {
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

export const safeIntlParts = (date, timezone) => {
    if (!timezone || typeof Intl === "undefined" || !Intl.DateTimeFormat) return null;
    try {
        const dtf = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
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

export const getTzOffsetMinutesForInstant = (timezone, dateUTC) => {
    const parts = safeIntlParts(dateUTC, timezone);
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

export const makeDateFromPartsInTz = (parts, timezone) => {
    const y = Number.isFinite(parts.year) ? parts.year : DATE_DEFAULTS.year;
    const m = Number.isFinite(parts.month) ? parts.month : DATE_DEFAULTS.month;
    const d = Number.isFinite(parts.day) ? parts.day : DATE_DEFAULTS.day;

    const hh = Number.isFinite(parts.hour) ? parts.hour : 0;
    const nn = Number.isFinite(parts.minute) ? parts.minute : 0;
    const ss = Number.isFinite(parts.second) ? parts.second : 0;
    const ms = Number.isFinite(parts.millisecond) ? parts.millisecond : 0;

    const utcGuess = new Date(Date.UTC(y, (m || 1) - 1, d || 1, hh, nn, ss, ms));

    const offsetStr = parseOffsetMinutes(timezone);
    if (typeof offsetStr === "number") {
        return new Date(utcGuess.getTime() - offsetStr * 60000);
    }

    if (timezone && typeof timezone === "string") {
        const off = getTzOffsetMinutesForInstant(timezone, utcGuess);
        return new Date(utcGuess.getTime() - off * 60000);
    }

    return new Date(y, (m || 1) - 1, d || 1, hh, nn, ss, ms);
};

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const INITIAL_TOKEN_PATTERNS = {
    YYYY: "\\d{4}",
    YY: "\\d{2}",
    MM: "\\d{2}",
    mm: "\\d{1,2}",
    DD: "\\d{2}",
    dd: "\\d{1,2}",
    HH: "\\d{2}",
    hh: "\\d{1,2}",
    ZZ: "\\d{2}",
    zz: "\\d{1,2}",
    NN: "\\d{2}",
    nn: "\\d{1,2}",
    SS: "\\d{2}",
    ss: "\\d{1,2}",
    LL: "\\d{3}",
    ll: "\\d{1,3}",
    AP: "AM|PM",
    ap: "am|pm",
    OO: ".+?",
    oo: ".+?",
    AA: ".+?",
    aa: ".+?",
};

export const parseInitialString = (str, initialFormat) => {
    const s = String(str || "").trim();
    const fmt = String(initialFormat || "").trim();
    if (!s || !fmt) return null;

    const tokens = Object.keys(INITIAL_TOKEN_PATTERNS).sort((a, b) => b.length - a.length);
    const groups = [];

    let pattern = escapeRegex(fmt);

    // Delimited mode: |DD|/|MM|/|YYYY|
    pattern = pattern.replace(/\\\|([A-Za-z]{2,4})\\\|/g, (full, token) => {
        if (!INITIAL_TOKEN_PATTERNS[token]) return full;
        groups.push(token);
        return `(${INITIAL_TOKEN_PATTERNS[token]})`;
    });

    // Plain token mode: DD/MM/YYYY HH:NN
    for (const token of tokens) {
        if (pattern.includes(token)) {
            pattern = pattern.split(token).join(`(${INITIAL_TOKEN_PATTERNS[token]})`);
            // push once per appearance
            const count = (fmt.match(new RegExp(token, "g")) || []).length;
            for (let i = 0; i < count; i++) groups.push(token);
        }
    }

    const re = new RegExp(`^${pattern}$`);
    const m = s.match(re);
    if (!m) return null;

    const picked = {};
    for (let i = 0; i < groups.length; i++) {
        const key = groups[i];
        const value = m[i + 1];
        if (value == null) continue;
        // Keep first occurrence when token repeats unexpectedly.
        if (picked[key] == null) picked[key] = value;
    }

    let year = picked.YYYY != null ? Number(picked.YYYY) : null;
    if (year == null && picked.YY != null) year = 2000 + Number(picked.YY);

    const month =
        picked.MM != null ? Number(picked.MM) : picked.mm != null ? Number(picked.mm) : null;
    const day =
        picked.DD != null ? Number(picked.DD) : picked.dd != null ? Number(picked.dd) : null;

    let hour = picked.HH != null ? Number(picked.HH) : picked.hh != null ? Number(picked.hh) : null;
    if (hour == null && (picked.ZZ != null || picked.zz != null)) {
        const h12 = picked.ZZ != null ? Number(picked.ZZ) : Number(picked.zz);
        const ampm = picked.AP ?? picked.ap ?? "";
        if (/pm/i.test(ampm)) hour = (h12 % 12) + 12;
        else hour = h12 % 12;
    }

    const minute =
        picked.NN != null ? Number(picked.NN) : picked.nn != null ? Number(picked.nn) : 0;
    const second =
        picked.SS != null ? Number(picked.SS) : picked.ss != null ? Number(picked.ss) : 0;
    const millisecond =
        picked.LL != null ? Number(picked.LL) : picked.ll != null ? Number(picked.ll) : 0;

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    if (hour != null && (hour < 0 || hour > 23)) return null;
    if (minute < 0 || minute > 59 || second < 0 || second > 59) return null;
    if (millisecond < 0 || millisecond > 999) return null;

    return {
        year,
        month,
        day,
        hour: hour ?? 0,
        minute,
        second,
        millisecond,
    };
};

export const pad = (n, len = 2) => String(Math.trunc(n)).padStart(len, "0");

export const formatWithTokens = (date, format, timezone) => {
    const fmt = String(format || "");
    const offsetMinutes = parseOffsetMinutes(timezone);

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
        const p = safeIntlParts(date, timezone);

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
                              timeZone: timezone || undefined,
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
                              timeZone: timezone || undefined,
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
                              timeZone: timezone || undefined,
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

export const resolveDefaultsFromStore = () => {
    const gd = baseStore?.globalData?.get?.() || {};
    const cd = baseStore?.clientData?.get?.() || {};
    const bs = gd.baseDateSettings || {};
    const defaultFormat =
        typeof bs.defaultFormat === "string" && bs.defaultFormat
            ? bs.defaultFormat
            : DATE_DEFAULTS.defaultFormat;

    const firstDayOfWeek = typeof bs.firstDayOfWeek === "number" ? bs.firstDayOfWeek : 1;

    const timezone = typeof cd.timeZone === "string" && cd.timeZone ? cd.timeZone : undefined;

    return { defaultFormat, firstDayOfWeek, timezone };
};

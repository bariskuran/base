const LOCALE_BY_LANGUAGE = {
    tr: "tr-TR",
    en: "en-US",
    de: "de-DE",
    fr: "fr-FR",
    es: "es-ES",
    it: "it-IT",
    nl: "nl-NL",
    pt: "pt-PT",
    ru: "ru-RU",
    ar: "ar",
    ja: "ja-JP",
    zh: "zh-CN",
};

export const resolveCountLocale = (language) => {
    if (!language) return "en-US";
    const key = String(language).toLowerCase();
    if (LOCALE_BY_LANGUAGE[key]) return LOCALE_BY_LANGUAGE[key];
    if (key.includes("-")) return language;
    return key;
};

/**
 * @returns {number|string}
 * - decimal > 0 → always string with fixed fraction digits (e.g. "2.00")
 * - enableLocale → locale-formatted string
 * - otherwise → number (decimal === 0)
 */
export const formatCountNumber = (
    value,
    { decimal = 0, enableLocale = true, language = "en" } = {},
) => {
    const n = Number(value);
    const safe = Number.isFinite(n) ? n : 0;
    const digits = Math.max(0, Math.floor(Number(decimal)) || 0);

    if (digits > 0) {
        if (enableLocale) {
            return safe.toLocaleString(resolveCountLocale(language), {
                minimumFractionDigits: digits,
                maximumFractionDigits: digits,
            });
        }
        return safe.toFixed(digits);
    }

    const whole = Math.round(safe);
    if (enableLocale) {
        return whole.toLocaleString(resolveCountLocale(language), {
            maximumFractionDigits: 0,
        });
    }
    return whole;
};

export const snapToStep = (value, start, step) => {
    const s = Number(step);
    if (!Number.isFinite(s) || s === 0) return value;
    const base = Number(start) || 0;
    const steps = Math.round((value - base) / s);
    return base + steps * s;
};

export const toFiniteNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};

/** endNumber[] → starts[] (per-index, shared scalar, or 0). */
export const resolveStartList = (startNumber, length) => {
    const len = Math.max(0, length);
    if (Array.isArray(startNumber)) {
        return Array.from({ length: len }, (_, index) => toFiniteNumber(startNumber[index], 0));
    }
    const shared =
        startNumber != null && startNumber !== "" ? toFiniteNumber(startNumber, 0) : 0;
    return Array.from({ length: len }, () => shared);
};

export const resolveEndList = (endNumber) => {
    if (!Array.isArray(endNumber)) return null;
    return endNumber.map((value) => toFiniteNumber(value, 0));
};

export const lerpCountValue = ({ from, to, progress, start, step }) => {
    let next = from + (to - from) * progress;
    if (step != null && Number.isFinite(Number(step))) {
        next = snapToStep(next, start, step);
        if (to >= from) next = Math.min(next, to);
        else next = Math.max(next, to);
    }
    return next;
};

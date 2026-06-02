export const FALSY_TYPES = Object.freeze([
    "undefined",
    "null",
    "emptyString",
    "false",
    "zeroNumber",
    "numberNan",
]);

const FALSY_TYPE_SET = new Set(FALSY_TYPES);

const normalizeTypeList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter((type) => FALSY_TYPE_SET.has(type));
};

const resolveStripOpts = (settings = {}) => {
    const deep = settings.deep ?? true;
    const only = normalizeTypeList(settings.only);
    const except = normalizeTypeList(settings.except);

    const enabled = Object.fromEntries(FALSY_TYPES.map((type) => [type, true]));

    if (only.length > 0) {
        for (const type of FALSY_TYPES) {
            enabled[type] = only.includes(type);
        }
    } else {
        const skip = new Set(except);
        for (const type of FALSY_TYPES) {
            enabled[type] = !skip.has(type);
        }
    }

    return { deep, ...enabled };
};

const shouldStrip = (value, opts) => {
    if (opts.undefined && value === undefined) return true;
    if (opts.null && value === null) return true;
    if (opts.emptyString && value === "") return true;
    if (opts.zeroNumber && value === 0) return true;
    if (opts.numberNan && typeof value === "number" && Number.isNaN(value)) return true;
    if (opts.false && value === false) return true;
    return false;
};

const cleanDeep = (value, opts) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => cleanDeep(item, opts))
            .filter((item) => !shouldStrip(item, opts));
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([, v]) => !shouldStrip(v, opts))
                .map(([key, v]) => [key, cleanDeep(v, opts)]),
        );
    }

    return value;
};

const cleanShallow = (value, opts) => {
    if (Array.isArray(value)) {
        return value.filter((item) => !shouldStrip(item, opts));
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).filter(([, v]) => !shouldStrip(v, opts)),
        );
    }

    return value;
};

export const cleanFalsyValues = (arg, settings = {}) => {
    if (!arg || typeof arg !== "object") return arg;

    const opts = resolveStripOpts(settings);

    return opts.deep ? cleanDeep(arg, opts) : cleanShallow(arg, opts);
};


export const typeOf = (...args) => {
    if (args.length === 0) return;

    const detect = (arg) => {
        if (arg === null) return "null";
        if (Array.isArray(arg)) return "array";
        if (arg instanceof Date) return "date";
        if (arg instanceof RegExp) return "regexp";
        if (arg instanceof Map) return "map";
        if (arg instanceof Set) return "set";
        if (arg instanceof Error) return "error";
        if (arg instanceof Promise) return "promise";

        return typeof arg;
    };

    const types = args.map(detect);
    return types.length > 1 ? types : types[0];
};

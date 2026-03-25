export const clearUndefinedDeep = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(clearUndefinedDeep);
    }

    if (obj && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => [key, clearUndefinedDeep(value)]),
        );
    }

    return obj;
};

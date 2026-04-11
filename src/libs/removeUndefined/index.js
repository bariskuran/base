export const removeUndefined = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
};

export const removeUndefinedDeep = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(removeUndefinedDeep);
    }

    if (obj && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => [key, removeUndefinedDeep(value)]),
        );
    }

    return obj;
};

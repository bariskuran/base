export const isObject = (value) => value != null && typeof value === "object" && !Array.isArray(value);

export const isValidIconArray = (value) => {
    if (!Array.isArray(value)) return false;
    if (value.length < 2) return false;

    const [viewBox, content] = value;

    if (typeof viewBox !== "string") return false;

    const nums = viewBox
        .trim()
        .split(/\s+/)
        .map((v) => Number(v));

    if (nums.length !== 2) return false;
    if (nums.some((v) => Number.isNaN(v) || v <= 0)) return false;

    return typeof content === "string" || typeof content === "function" || content != null;
};

/**
 * Enhanced `typeof` utility with correct handling for `array` and `null`.
 *
 * - Returns `"array"` for arrays
 * - Returns `"null"` for `null`
 * - Behaves like native `typeof` for all other values
 * - Supports multiple arguments
 *
 * @param {...any} args - Values whose types will be detected.
 *
 * @returns {string | string[] | undefined}
 * - If no arguments are provided, returns `undefined`.
 * - If one argument is provided, returns its type as a string.
 * - If multiple arguments are provided, returns an array of type strings
 *   in the same order as the arguments.
 *
 * @example
 * typeOf(123);              // "number"
 * typeOf("hello");          // "string"
 * typeOf(null);             // "null"
 * typeOf([]);               // "array"
 * typeOf({});               // "object"
 * typeOf(() => {});         // "function"
 *
 * @example
 * typeOf(1, "a", null, []); // ["number", "string", "null", "array"]
 */
export const typeOf = (...args) => {
    if (args.length === 0) return;
    const types = [];
    args.forEach((arg) => {
        let type = typeof arg;
        if (type === "object" && Array.isArray(arg)) type = "array";
        if (type === "object" && !arg) type = "null";
        types.push(type);
    });

    return types.length > 1 ? types : types[0];
};

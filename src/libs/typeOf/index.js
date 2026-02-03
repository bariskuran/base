/**
 * Enhanced `typeof` utility with special handling for common built-in types.
 *
 * Differences from native `typeof`:
 * - Returns `"null"` for `null`
 * - Returns `"array"` for arrays
 * - Detects certain built-in objects:
 *   - `"date"` for `Date`
 *   - `"regexp"` for `RegExp`
 *   - `"map"` for `Map`
 *   - `"set"` for `Set`
 *   - `"error"` for `Error`
 *   - `"promise"` for `Promise`
 *
 * Notes:
 * - For all other values it behaves like native `typeof`.
 * - Supports multiple arguments; returns an array of type strings in the same order.
 *
 * @param {...any} args - Values whose types will be detected.
 *
 * @returns {string | string[] | undefined}
 * - If no arguments are provided, returns `undefined`.
 * - If one argument is provided, returns its type as a string.
 * - If multiple arguments are provided, returns an array of type strings.
 *
 * @example
 * typeOf(123);                 // "number"
 * typeOf("hello");             // "string"
 * typeOf(true);                // "boolean"
 * typeOf(undefined);           // "undefined"
 * typeOf(() => {});            // "function"
 * typeOf({});                  // "object"
 *
 * @example
 * typeOf(null);                // "null"
 * typeOf([]);                  // "array"
 * typeOf(new Date());          // "date"
 * typeOf(/abc/i);              // "regexp"
 * typeOf(new Map());           // "map"
 * typeOf(new Set());           // "set"
 * typeOf(new Error("x"));      // "error"
 * typeOf(Promise.resolve());   // "promise"
 *
 * @example
 * typeOf(1, "a", null, [], new Date());
 * // ["number", "string", "null", "array", "date"]
 */
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

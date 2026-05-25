import { baseStore } from "../@baseStore";
import { typeOf } from "../typeOf";

/**
 * manageSearchParams
 * ------------------
 * Typed, nested, optionally base64-encoded URL search params manager.
 *
 * This utility allows you to store a full typed JavaScript object
 * inside the URL search string, supporting:
 *
 * - Automatic type encoding / decoding
 * - Nested objects & arrays (bracket notation)
 * - Optional base64 encoding (default)
 * - Raw (non-base64) query mode
 * - React Router navigation integration
 *
 * Internally it uses a single query payload instead of traditional
 * key=value&key2=value2 patterns.
 *
 * ------------------------------------------------------------------
 * FORMAT
 * ------------------------------------------------------------------
 * Raw format (before base64):
 *   a=(*1*)3&b[x]=(*0*)hello&flags[enabled]=(*6*)true
 *
 * Base64 format (default):
 *   ?YT0oKjEqKTMmYlt4XT0oKjAqKWhlbGxvJmZsYWdzW2VuYWJsZWRdPSgqNioqKXRydWU=
 *
 * ------------------------------------------------------------------
 * METHODS
 * ------------------------------------------------------------------
 *
 * get()
 * -----
 * Reads the current location.search and returns the decoded object.
 * Automatically detects whether the query is:
 * - base64 encoded
 * - or raw (non-base64)
 *
 * Returns:
 *   [decodedObject, decodedString?]
 *
 * @example for GET:
 *   const [params] = manageSearchParams.get();
 *   // params => { a: 3, b: { x: "hello" }, flags: { enabled: true } }
 *
 * @
 * set(object, options?)
 * ---------------------
 * Encodes the given object and writes it to the URL.
 *
 * - `undefined` and `null` values are NOT written to the query.
 * - Nested objects/arrays are supported.
 *
 * Options:
 *   skipSetAndReturnEncoded?: boolean
 *     - If true, does not navigate; only returns the encoded value.
 *
 *   maxLength?: number
 *     - If > 0 and payload exceeds length, query is cleared.
 *
 *   disableAToB?: boolean
 *     - If true, writes raw (non-base64) query string.
 *     - Default: false (base64 encoded).
 *
 * @example (base64, default):
 *   manageSearchParams.set({
 *     a: 1,
 *     filters: { active: true },
 *   });
 *
 * @example for SET (raw query):
 *   manageSearchParams.set(
 *     { a: 1, filters: { active: true } },
 *     { disableAToB: true }
 *   );
 *
 * @
 * clear(options?)
 * ---------------
 * Removes all search params and navigates to pathname only.
 *
 * Options:
 *   skipSetAndReturnEncoded?: boolean
 *     - If true, does not navigate.
 *
 * @example for SET
 * manageSearchParams.clear();
 *
 * @
 * ------------------------------------------------------------------
 * NOTES
 * ------------------------------------------------------------------
 * - Designed to work with baseStore.globalData `_reactRouterDom` (GlobalDataProvider)
 * - Intended for application state, filters, flags, UI config
 * - NOT meant for SEO-visible query parameters
 */
export const manageSearchParams = {
    get: () => {
        const { location } = baseStore.globalData.get()?._reactRouterDom || {};
        const empty = {};
        let qs = location?.search;

        if (!qs) return [empty];

        qs = qs.startsWith("?") ? qs.slice(1) : qs;
        if (!qs) return [empty];

        const parseTyped = (payload) => {
            if (!payload || typeof payload !== "string") return null;
            if (!payload.includes("(*")) return null;

            const out = {};
            const parts = payload.split("&");
            if (!parts.length) return null;

            const processValue = (key, value, outObj) => {
                if (key.includes("[")) {
                    const keys = key.split(/\[|\]/).filter(Boolean);
                    let temp = outObj;

                    for (let i = 0; i < keys.length; i++) {
                        const currentKey = keys[i];

                        if (temp[currentKey] === undefined) {
                            if (i === keys.length - 1) {
                                temp[currentKey] = stringToType(value);
                            } else {
                                temp[currentKey] = isNaN(keys[i + 1]) ? {} : [];
                            }
                        }
                        temp = temp[currentKey];
                    }
                } else {
                    outObj[key] = stringToType(value);
                }
            };

            let didParse = false;

            for (const part of parts) {
                if (!part) continue;

                const eqIndex = part.indexOf("=");
                if (eqIndex === -1) continue;

                const key = part.slice(0, eqIndex);
                const value = part.slice(eqIndex + 1);

                if (!key) continue;

                const decodedKey = decodeURIComponent(key);
                const decodedValue = decodeURIComponent(value ?? "");

                processValue(decodedKey, decodedValue, out);
                didParse = true;
            }

            return didParse ? out : null;
        };

        const rawParsed = parseTyped(qs);
        if (rawParsed) return [rawParsed, qs];

        const decoded = safeAtob(qs);
        if (!decoded) return [empty];

        const decodedParsed = parseTyped(decoded);
        if (decodedParsed) return [decodedParsed, decoded];

        return [empty, decoded];
    },
    set: (obj, settings) => {
        const {
            skipSetAndReturnEncoded,
            maxLength = 0,
            disableAToB = false,
            replace = true,
        } = settings || {};

        const { navigate, location } = baseStore.globalData.get()?._reactRouterDom || {};

        if (!obj || Object.keys(obj).length < 1) {
            if (!skipSetAndReturnEncoded && typeof navigate === "function") {
                navigate(`${location?.pathname || ""}`, { replace });
            }
            return [];
        }

        const getPairs = (it, keys = []) =>
            Object.entries(it).reduce((pairs, [key, value]) => {
                if (value === null || value === undefined) return pairs;

                if (typeof value === "object" && value !== null) {
                    pairs.push(...getPairs(value, [...keys, key]));
                } else {
                    pairs.push([[...keys, key], value]);
                }
                return pairs;
            }, []);

        const rawString = getPairs(obj)
            .map(([[key0, ...keysRest], value]) => {
                const left = `${key0}` + keysRest.map((a) => `[${encodeURIComponent(a)}]`).join("");
                const right = encodeURIComponent(typeToString(value));
                return `${left}=${right}`;
            })
            .join("&");

        let payload = disableAToB ? rawString : safeBtoa(rawString);

        if (maxLength > 0 && payload.length > maxLength) payload = "";

        if (!skipSetAndReturnEncoded && typeof navigate === "function") {
            const qs = payload ? `?${payload}` : "";
            navigate(`${location?.pathname || ""}${qs}`, { replace });
        }

        return [payload, rawString];
    },
    clear: (settings) => {
        const { skipSetAndReturnEncoded, replace = true } = settings || {};
        const { navigate, location } = baseStore.globalData.get()?._reactRouterDom || {};

        if (!skipSetAndReturnEncoded && typeof navigate === "function") {
            navigate(`${location?.pathname || ""}`, { replace });
        }

        return [];
    },
};

const TYPE_NUMBERS = [
    ["string", 0],
    ["number", 1],
    ["undefined", 2],
    ["null", 3],
    ["object", 4],
    ["array", 5],
    ["boolean", 6],
    ["function", 7],
    ["symbol", 8],
    ["bigint", 9],
];

const stringToType = (encodedValue) => {
    const regex = /\(\*(\w+)\*\)(.*)/;
    const match = encodedValue?.match(regex);
    if (!match) return encodedValue;

    const [, typeNumber, value] = match;
    const type = TYPE_NUMBERS.find((it) => it[1] === Number(typeNumber))?.[0];

    if (type === "number") return Number(value);
    if (type === "boolean") return value.toLowerCase() === "true";
    if (type === "function") return new Function(value);
    if (type === "bigint") return BigInt(value);
    if (type === "symbol") return Symbol(value);
    if (type === "undefined") return undefined;
    if (type === "null") return null;
    return value;
};

const typeToString = (value) => {
    const type = typeOf(value);
    const typeNumber = TYPE_NUMBERS.find((it) => it[0] === type)?.[1];
    return "(*" + typeNumber + "*)" + value;
};

const safeAtob = (s) => {
    if (typeof atob !== "function") return "";
    try {
        return atob(s);
    } catch {
        return "";
    }
};

const safeBtoa = (s) => {
    if (typeof btoa !== "function") return "";
    try {
        return btoa(s);
    } catch {
        return "";
    }
};

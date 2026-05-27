import { baseStore } from "../@baseStore";
import { byPath } from "../byPath";
import { getText } from "../getText";
import { isShallowEqual } from "../isShallowEqual";
import { notifier } from "../notifier";
import { typeOf } from "../typeOf";

export const manageSearchParams = {
    get: (settings) => {
        const {
            mapping,
            defaults,
            setDefaultsOnMount = true,
            replace = true,
            maxLength,
            skipSet,
        } = settings || {};
        const { location } = baseStore.globalData.get()?._reactRouterDom || {};
        const empty = {};
        let qs = location?.search;

        if (!qs) {
            return [
                resolveGetResult(empty, {
                    mapping,
                    defaults,
                    setDefaultsOnMount,
                    replace,
                    maxLength,
                    skipSet,
                }),
            ];
        }

        qs = qs.startsWith("?") ? qs.slice(1) : qs;
        if (!qs) {
            return [
                resolveGetResult(empty, {
                    mapping,
                    defaults,
                    setDefaultsOnMount,
                    replace,
                    maxLength,
                    skipSet,
                }),
            ];
        }

        const parsePayload = (payload) => {
            if (!payload || typeof payload !== "string") return null;

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

                if (!isValidQueryKey(decodedKey)) continue;

                processValue(decodedKey, decodedValue, out);
                didParse = true;
            }

            return didParse ? out : null;
        };

        const decoded = safeAtob(qs);
        if (decoded) {
            const decodedParsed = parsePayload(decoded);
            if (decodedParsed) {
                return [
                    resolveGetResult(decodedParsed, {
                        mapping,
                        defaults,
                        setDefaultsOnMount,
                        replace,
                        maxLength,
                        skipSet,
                    }),
                    decoded,
                ];
            }
        }

        const rawParsed = parsePayload(qs);
        if (rawParsed) {
            return [
                resolveGetResult(rawParsed, {
                    mapping,
                    defaults,
                    setDefaultsOnMount,
                    replace,
                    maxLength,
                    skipSet,
                }),
                qs,
            ];
        }

        return [
            resolveGetResult(empty, {
                mapping,
                defaults,
                setDefaultsOnMount,
                replace,
                maxLength,
                skipSet,
            }),
            decoded || qs,
        ];
    },
    set: (obj, settings) => {
        const {
            defaults,
            disableSetDefaults = false,
            skipSet,
            maxLength,
            disableBase64 = false,
            disableTypeControl = false,
            replace = true,
        } = settings || {};

        const merged = resolveObjectWithDefaults(obj, defaults, disableSetDefaults);

        const { navigate, location } = baseStore.globalData.get()?._reactRouterDom || {};
        const resolvedMaxLength = resolveMaxSearchPayloadLength(maxLength, location);

        if (!merged || Object.keys(merged).length < 1) {
            if (!skipSet && typeof navigate === "function") {
                navigate(`${location?.pathname || ""}`, { replace });
            }
            return [];
        }

        const chunkStrings = getChunkStrings(merged, disableTypeControl);
        const { rawString, payload, exceeded } = getMaxLengthSafePayload({
            chunkStrings,
            maxLength: resolvedMaxLength,
            disableBase64,
        });

        if (exceeded) {
            const warningText = getText("searchParamsExceededMaxLength");
            console.warn("[manageSearchParams.set] searchParams exceed maxLength", {
                maxLength: resolvedMaxLength,
                browserMaxUrl: getBrowserMaxUrlLength(),
                warningText,
            });

            const disableNotifierGlobal = !!baseStore.globalData.get()?._notifier?.disableNotifier;
            if (!disableNotifierGlobal) {
                notifier.add(warningText || "searchParams exceed maxLength", {
                    bgColor: "error",
                });
            }
        }

        if (!skipSet && typeof navigate === "function") {
            const qs = payload ? `?${payload}` : "";
            navigate(`${location?.pathname || ""}${qs}`, { replace });
        }

        return [payload, rawString];
    },
    clear: (settings) => {
        const { skipSet, replace = true } = settings || {};
        const { navigate, location } = baseStore.globalData.get()?._reactRouterDom || {};

        if (!skipSet && typeof navigate === "function") {
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
    if (!match) return inferPrimitiveType(encodedValue);

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

const typeToString = (value, disableTypeControl = false) => {
    if (disableTypeControl) return `${value}`;

    const type = typeOf(value);
    const typeNumber = TYPE_NUMBERS.find((it) => it[0] === type)?.[1];
    return "(*" + typeNumber + "*)" + value;
};

const inferPrimitiveType = (value) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    if (trimmed === "") return value;

    if (/^true$/i.test(trimmed)) return true;
    if (/^false$/i.test(trimmed)) return false;

    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

    return value;
};

const isValidQueryKey = (key) => {
    if (typeof key !== "string" || key.trim() === "") return false;
    return /^[a-zA-Z0-9_.-]+(?:\[[^\]]+\])*$/.test(key);
};

const getBrowserMaxUrlLength = () => {
    const fromClient = baseStore.globalData.get()?._clientData?.urlMaxLength;
    return typeof fromClient === "number" && fromClient > 0 ? fromClient : 2048;
};

const getBaseUrlLength = (location) => {
    const pathname = location?.pathname || "/";

    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin.length + pathname.length + 1;
    }

    return pathname.length + 1;
};

/** maxLength omitted → browser budget for query; 0 → no limit; number → min(user, browser budget). */
export const resolveMaxSearchPayloadLength = (maxLength, location) => {
    const browserMaxUrl = getBrowserMaxUrlLength();
    const baseLength = getBaseUrlLength(location);
    const browserPayloadBudget = Math.max(0, browserMaxUrl - baseLength);

    if (maxLength === 0) return 0;
    if (maxLength == null) return browserPayloadBudget;
    return Math.min(maxLength, browserPayloadBudget);
};

const mergeWithDefaults = (defaults, obj) => {
    if (!defaults || typeof defaults !== "object") return { ...(obj || {}) };
    return { ...defaults, ...(obj || {}) };
};

/** disableSetDefaults true → encode object as-is (no default keys added). */
const resolveObjectWithDefaults = (obj, defaults, disableSetDefaults) => {
    if (disableSetDefaults === true) return { ...(obj || {}) };
    return mergeWithDefaults(defaults, obj);
};

const resolveGetResult = (
    parsed,
    { mapping, defaults, setDefaultsOnMount, replace, maxLength, skipSet },
) => {
    const parsedObj = parsed || {};
    const withDefaults = mergeWithDefaults(defaults, parsedObj);

    if (
        setDefaultsOnMount !== false &&
        defaults &&
        typeof defaults === "object" &&
        !isShallowEqual(parsedObj, withDefaults)
    ) {
        manageSearchParams.set(withDefaults, {
            replace,
            maxLength,
            skipSet,
            disableSetDefaults: true,
        });
    }

    if (mapping && typeof mapping === "object") {
        return byPath.mapping(withDefaults, mapping);
    }

    return withDefaults;
};

const getChunkStrings = (obj, disableTypeControl) => {
    if (!obj || typeof obj !== "object") return [];

    return Object.entries(obj).reduce((chunks, [topLevelKey, topLevelValue]) => {
        if (topLevelValue === null || topLevelValue === undefined) return chunks;

        const pairs = getPairsByPath(topLevelValue, [topLevelKey]);
        if (pairs.length < 1) return chunks;

        const chunk = pairs
            .map(([pathKeys, value]) => toQueryPair(pathKeys, value, disableTypeControl))
            .join("&");

        if (chunk) chunks.push(chunk);
        return chunks;
    }, []);
};

const getPairsByPath = (value, path) => {
    if (value === null || value === undefined) return [];

    if (typeof value === "object") {
        const entries = Object.entries(value);
        if (entries.length < 1) return [];

        return entries.reduce((all, [key, nestedValue]) => {
            return [...all, ...getPairsByPath(nestedValue, [...path, key])];
        }, []);
    }

    return [[path, value]];
};

const toQueryPair = (pathKeys, value, disableTypeControl) => {
    const [key0, ...keysRest] = pathKeys;
    const left = `${key0}` + keysRest.map((a) => `[${encodeURIComponent(a)}]`).join("");
    const right = encodeURIComponent(typeToString(value, disableTypeControl));
    return `${left}=${right}`;
};

const getMaxLengthSafePayload = ({ chunkStrings, maxLength, disableBase64 }) => {
    if (!Array.isArray(chunkStrings) || chunkStrings.length < 1) {
        return { rawString: "", payload: "", exceeded: false };
    }

    if (!(maxLength > 0)) {
        const rawString = chunkStrings.join("&");
        return {
            rawString,
            payload: disableBase64 ? rawString : safeBtoa(rawString),
            exceeded: false,
        };
    }

    const acceptedChunks = [];
    let exceeded = false;

    for (const chunk of chunkStrings) {
        if (!chunk) continue;

        const nextRaw = acceptedChunks.length > 0 ? `${acceptedChunks.join("&")}&${chunk}` : chunk;
        const nextPayload = disableBase64 ? nextRaw : safeBtoa(nextRaw);

        if (nextPayload.length <= maxLength) {
            acceptedChunks.push(chunk);
        } else {
            exceeded = true;
        }
    }

    const rawString = acceptedChunks.join("&");
    const payload = rawString ? (disableBase64 ? rawString : safeBtoa(rawString)) : "";

    return { rawString, payload, exceeded };
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

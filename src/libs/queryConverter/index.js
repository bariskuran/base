/**
 * queryConverter
 * --------------
 * Nested object <-> query string converter (bracket notation).
 *
 * - Supports nested objects/arrays: a[b][0]=x
 * - Supports optional prefixing: filters[a]=1
 * - Can skip empty values (default) or preserve them
 * - Can parse booleans/numbers unless you preserve them as strings
 *
 * @example
 * const qs = queryConverter.export(
 *   { a: 1, b: { x: "hello" }, list: ["a", "b"], empty: "" },
 *   { preserveEmpty: false }
 * );
 * // "a=1&b[x]=hello&list[0]=a&list[1]=b"
 *
 * @example
 * const obj = queryConverter.import(
 *   "a=1&b[x]=hello&list[0]=a&list[1]=b&flag=true",
 *   { preserveBooleans: false, preserveNumbers: false }
 * );
 * // { a: 1, b: { x: "hello" }, list: ["a","b"], flag: true }
 *
 * @example
 * const qs2 = queryConverter.export(
 *   { page: 2, filter: { q: "test" } },
 *   { prefix: "filters" }
 * );
 * // "filters[page]=2&filters[filter][q]=test"
 *
 * @example
 * const onlyFilters = queryConverter.import(
 *   "filters[page]=2&filters[filter][q]=test",
 *   { prefix: "filters" }
 * );
 * // { page: 2, filter: { q: "test" } }
 */
export const queryConverter = {
    export: (obj, settings = {}) => {
        const { preserveEmpty = false, prefix, ignoreEncode = false } = settings;

        if (!obj || typeof obj !== "object") return "";

        const parts = [];

        const encode = (v) => (ignoreEncode ? String(v) : encodeURIComponent(String(v)));

        const shouldSkip = (v) => !preserveEmpty && (v === null || v === undefined || v === "");

        const buildKey = (base, k) => (base ? `${base}[${k}]` : `${k}`);

        const walk = (value, keyPath) => {
            if (shouldSkip(value)) return;

            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    walk(value[i], `${keyPath}[${i}]`);
                }
                return;
            }

            if (value && typeof value === "object") {
                for (const k of Object.keys(value)) {
                    walk(value[k], `${keyPath}[${k}]`);
                }
                return;
            }

            parts.push(`${keyPath}=${encode(value)}`);
        };

        for (const k of Object.keys(obj)) {
            const keyPath = prefix ? buildKey(prefix, k) : `${k}`;
            walk(obj[k], keyPath);
        }

        return "?" + parts.join("&");
    },

    import: (str, settings = {}) => {
        const { preserveBooleans = false, preserveNumbers = false, prefix } = settings;

        const out = {};
        if (!str || typeof str !== "string") return out;

        const params = str.startsWith("?") ? str.slice(1) : str;
        if (!params) return out;

        const parseValue = (raw) => {
            if (raw === "") return raw;

            if (!preserveBooleans && (raw === "true" || raw === "false")) {
                return raw === "true";
            }

            if (!preserveNumbers) {
                const n = Number(raw);
                if (Number.isFinite(n) && raw.trim() !== "") return n;
            }

            return raw;
        };

        const ensureContainer = (parent, key, nextKey) => {
            if (parent[key] !== undefined) return;

            const nextLooksArray =
                nextKey !== undefined && nextKey !== null && nextKey !== "" && !isNaN(nextKey);

            parent[key] = nextLooksArray ? [] : {};
        };

        const setDeep = (root, keys, value) => {
            let cur = root;

            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                const isLast = i === keys.length - 1;
                const nextK = keys[i + 1];

                if (isLast) {
                    cur[k] = value;
                    return;
                }

                ensureContainer(cur, k, nextK);
                cur = cur[k];
            }
        };

        const splitKey = (k) => k.split(/\[|\]/).filter(Boolean);

        for (const pair of params.split("&")) {
            if (!pair) continue;

            const eq = pair.indexOf("=");
            const rawKey = eq === -1 ? pair : pair.slice(0, eq);
            const rawVal = eq === -1 ? "" : pair.slice(eq + 1);

            if (!rawKey) continue;

            const decodedKey = decodeURIComponent(rawKey);
            const decodedVal = parseValue(decodeURIComponent(rawVal));

            if (!decodedKey.includes("[") && !decodedKey.includes("]")) {
                out[decodedKey] = decodedVal;
                continue;
            }

            const keyParts = splitKey(decodedKey);
            if (keyParts.length === 0) continue;

            setDeep(out, keyParts, decodedVal);
        }

        if (
            prefix &&
            out[prefix] &&
            typeof out[prefix] === "object" &&
            !Array.isArray(out[prefix])
        ) {
            const pref = out[prefix];
            delete out[prefix];
            return pref;
        }

        return out;
    },
};

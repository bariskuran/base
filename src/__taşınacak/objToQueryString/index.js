export const objToQueryString = (obj, settings = {}) => {
    const { preserveEmpty = false, prefix, ignoreEncode = false } = settings;

    const str = [];

    const processValue = (value, currentPrefix) => {
        if (!preserveEmpty && (value === null || value === undefined || value === "")) return;

        if (value !== null && typeof value === "object") {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    processValue(item, `${currentPrefix}[${index}]`);
                });
            } else {
                for (const key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        processValue(value[key], `${currentPrefix}[${key}]`);
                    }
                }
            }
        } else {
            str.push(`${currentPrefix}=${ignoreEncode ? value : encodeURIComponent(value)}`);
        }
    };

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const currentPrefix = prefix ? `${prefix}[${key}]` : key;
            processValue(obj[key], currentPrefix);
        }
    }

    return str.join("&");
};

export const queryStringToObj = (str, settings = {}) => {
    const { preserveBooleans = false, preserveNumbers = false, prefix } = settings;
    // If you want to keep boolenas ands numbers as string, set preserveBooleans and preserveNumbers to true.
    // if incoming str is a 1st level object, such as "filters", set prefix to "filters" to remove it.

    const obj = {};
    if (!str || typeof str !== "string") return obj;

    const params = str.startsWith("?") ? str.slice(1) : str;

    const parseValue = (value) => {
        if (value === "") return value;

        if (!preserveBooleans && (value === "true" || value === "false")) {
            return value === "true";
        }

        if (!preserveNumbers && !isNaN(value)) {
            return Number(value);
        }

        return value;
    };

    params.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        if (!key) return;

        const decodedKey = decodeURIComponent(key);
        const decodedValue = parseValue(decodeURIComponent(value || ""));

        if (!decodedKey.includes("[") && !decodedKey.includes("]")) {
            obj[decodedKey] = decodedValue;
            return;
        }

        const setNestedValue = (obj, keys, value) => {
            let current = obj;
            let currentKey = keys[0];

            if (!current[currentKey]) {
                if (!isNaN(keys[1]) || !isNaN(currentKey)) {
                    current[currentKey] = [];
                } else {
                    current[currentKey] = {};
                }
            }

            current = current[currentKey];

            for (let i = 1; i < keys.length; i++) {
                const key = keys[i];
                if (i === keys.length - 1) {
                    current[key] = value;
                } else {
                    if (!current[key]) {
                        current[key] = !isNaN(keys[i + 1]) ? [] : {};
                    }
                    current = current[key];
                }
            }
        };

        const keyParts = decodedKey.split(/\[|\]/).filter(Boolean);

        setNestedValue(obj, keyParts, decodedValue);
    });

    if (prefix && obj[prefix] && typeof obj[prefix] === "object" && !Array.isArray(obj[prefix])) {
        const prefixValue = obj[prefix];
        delete obj[prefix];
        return prefixValue;
    }

    return obj;
};

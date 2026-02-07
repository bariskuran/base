import { baseStore } from "../../@baseStore";

export const isAbsoluteUrl = (url = "") => /^https?:\/\//i.test(String(url || "").trim());

export const joinUrl = (base, path) => {
    const b = String(base || "")
        .trim()
        .replace(/\/+$/, "");
    const p = String(path || "")
        .trim()
        .replace(/^\/+/, "");
    if (!b) return `/${p}`;
    if (!p) return b;
    return `${b}/${p}`;
};

export const applyEnvUrl = (url, envUrl) => {
    const u = String(url || "").trim();
    if (!u) return u;
    if (isAbsoluteUrl(u)) return u;
    const base = String(envUrl || "").trim();
    return joinUrl(base, u);
};

export const resolvePayload = (payloadAdaptor, prevResults = []) => {
    if (typeof payloadAdaptor === "function") {
        return payloadAdaptor(...prevResults);
    }
    return payloadAdaptor;
};

export const normalizeMethod = (m) => String(m || "GET").toUpperCase();

export const buildHeaders = (headers) => {
    const h = headers && typeof headers === "object" ? { ...headers } : {};
    if (!h.Accept) h.Accept = "application/json";
    return h;
};

export const checkCallProps = (call = {}) => {
    const errors = [];

    const url = String(call.url || "").trim();
    if (!url) errors.push("No url provided.");

    const method = normalizeMethod(call.method);
    const allowed = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
    if (!allowed.includes(method)) errors.push(`Invalid method "${method}".`);

    const credentials = call.credentials ?? "include";
    const credAllowed = ["include", "same-origin", "omit"];
    if (!credAllowed.includes(credentials)) errors.push(`Invalid credentials "${credentials}".`);

    return { ok: errors.length === 0, errors };
};

const LS_KEY = "baseResponses";
const MAX_BYTES = 5 * 1024 * 1024;

const safeParse = (s) => {
    try {
        return JSON.parse(s);
    } catch {
        return null;
    }
};

export const getCacheStore = () => {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = safeParse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
};

export const setCacheStore = (obj) => {
    localStorage.setItem(LS_KEY, JSON.stringify(obj || {}));
};

export const bytesOfJson = (v) => {
    try {
        const str = typeof v === "string" ? v : JSON.stringify(v);
        if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(str).length;
        return unescape(encodeURIComponent(str)).length;
    } catch {
        return Infinity;
    }
};

export const pruneExpiredCache = (store, nowTs) => {
    const out = {};
    for (const [k, v] of Object.entries(store || {})) {
        const exp = Number(v?.expiresAt || 0);
        if (exp && exp > nowTs) out[k] = v;
    }
    return out;
};

export const makeCacheKey = ({ url, method = "GET", body } = {}) => {
    let b = "";
    if (body != null) {
        try {
            b = typeof body === "string" ? body : JSON.stringify(body);
        } catch {
            b = String(body);
        }
    }
    return `${normalizeMethod(method)}::${url}::${b}`;
};

export const getFromCache = ({ cacheKey, nowTs }) => {
    const store = pruneExpiredCache(getCacheStore(), nowTs);
    setCacheStore(store);

    const hit = store[cacheKey];
    if (!hit) return null;

    return hit.data;
};

export const addToCache = ({ cacheKey, data, ttlMs }) => {
    const nowTs = Date.now();
    const store = pruneExpiredCache(getCacheStore(), nowTs);

    const itemBytes = bytesOfJson({ data, expiresAt: nowTs + ttlMs });
    if (itemBytes > MAX_BYTES) {
        return { ok: false, reason: "CACHE_ITEM_TOO_LARGE" };
    }

    store[cacheKey] = { data, expiresAt: nowTs + ttlMs };

    const nextBytes = bytesOfJson(store);
    if (nextBytes > MAX_BYTES) {
        setCacheStore({});
        return { ok: false, reason: "CACHE_CAPACITY_EXCEEDED_CLEARED" };
    }

    setCacheStore(store);
    return { ok: true };
};

export const resolveToken = async ({ disableAuth, token, getTokenFrom }) => {
    if (disableAuth) return null;
    if (token) return token;
    if (typeof getTokenFrom === "function") {
        try {
            const t = await getTokenFrom(baseStore);
            return t || null;
        } catch {
            return null;
        }
    }
    return null;
};

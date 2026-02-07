import { baseStore } from "../../@baseStore";

const normalizeUrl = (rawUrl = "") => {
    try {
        const u = new URL(
            rawUrl,
            typeof window !== "undefined" ? window.location.origin : "http://x",
        );
        u.hash = "";
        const params = Array.from(u.searchParams.entries()).sort(([aK, aV], [bK, bV]) =>
            aK === bK ? String(aV).localeCompare(String(bV)) : aK.localeCompare(bK),
        );
        u.search = "";
        for (const [k, v] of params) u.searchParams.append(k, v);
        return u.pathname + (u.search ? `?${u.searchParams.toString()}` : "");
    } catch {
        return String(rawUrl).trim();
    }
};

const buildDedupeKey = ({ url = "unknown", method = "GET" } = {}, location) => {
    return `${location.pathname}|${String(method).toUpperCase()}|${normalizeUrl(url)}`;
};

export const loadingApi = {
    add: (item = {}, settings = {}) => {
        const setGlobal = baseStore.globalData.set;
        const {
            _loadingManager: { apiQueue = [] } = {},
            isDevMode,
            _reactRouterDom: { location } = {},
        } = baseStore.globalData.get();

        const { queueName = buildDedupeKey(item, location), url = "unknown" } = item;
        const { enableMultiple = false } = settings;

        if (!url) return false;

        const find = apiQueue.find((q) => q.queueName === queueName);

        if (!enableMultiple && find) {
            isDevMode && console.log("Allready in queue.");
            return false;
        }

        setGlobal((s) => {
            s.isLoadingApi = true;
            s.isLoading = true;
            s._loadingManager = {
                ...s._loadingManager,
                apiQueue: [...s._loadingManager.apiQueue, { queueName, url }],
            };
        });

        return queueName;
    },
    remove: (queueName) => {
        if (!queueName) return false;
        const setGlobal = baseStore.globalData.set;
        const {
            isLoadingPage,
            _loadingManager: { apiQueue = [] } = {},
            isDevMode,
        } = baseStore.globalData.get();

        const find = apiQueue.find((q) => q.queueName === queueName);

        if (!find) {
            isDevMode && console.log("Not found in queue.");
            return false;
        }

        const newApiQueue = apiQueue.filter((q) => q.queueName !== queueName);

        setGlobal((s) => {
            s.isLoadingApi = newApiQueue.length > 0;
            s.isLoading = newApiQueue.length > 0 || isLoadingPage;
            s._loadingManager = {
                ...s._loadingManager,
                apiQueue: newApiQueue,
            };
        });

        return true;
    },
    clear: () => {
        const setGlobal = baseStore.globalData.set;
        const { isLoadingPage } = baseStore.globalData.get();
        setGlobal((s) => {
            s.isLoadingApi = false;
            s.isLoading = isLoadingPage;
            s._loadingManager = {
                ...s._loadingManager,
                apiQueue: [],
            };
        });

        return true;
    },
};

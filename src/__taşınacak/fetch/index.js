import { handleResponse } from "./handleResponse";
import { fetchStoreExe } from "./fetchStoreExe";
import { getFromCache, addToCache } from "./cacheManager";
import { addToNotifier } from "../addToNotifier";
import { getDate } from "../getDate";
import { clearLoading } from "../clearLoading";
import { clearApiLoading } from "../clearApiLoading";
import { rrdStore } from "../RrdGlobals";
import { baseStore } from "../baseStore";
// import { objToQueryString } from "../objToQueryString";

export const fetch = async (settings = {}) => {
    const { navigate } = rrdStore?.getState() || {};
    const fetchStore = fetchStoreExe(settings) || {};
    const {
        addToApiLoading,
        body,
        credentials,
        // dataCatcher, // check out fetchStoreExe for details
        disableApiLoading,
        disableAuth,
        disableNotifier,
        // errorCatcher,
        // global_envUrl,
        global_errorPageUrl,
        global_onError,
        global_onSuccess,
        graphMethod,
        graphQuery,
        handleData,
        killOnError,
        killOnErrorCallbackUrl,
        method,
        onError,
        onSuccess,
        removeFromApiLoading,
        // params, -> these are handled in fetchStoreExe
        // paramsExporter, -> these are handled in fetchStoreExe
        // responseCodeCatcher,
        token,
        url,
        useCache,
        // useEnvUrl = true,
    } = fetchStore;

    // Check Url & authToken
    if (!url) {
        console.log("No url");
        return;
    }
    if (!disableAuth && !token) {
        console.log("No token");
        navigate("/login");
        return;
    }

    // Get data from LS if useCache enabled or remove old cacheData
    if (
        useCache &&
        ((graphQuery && graphMethod === "query") || (!graphQuery && method === "GET"))
    ) {
        const cacheResult = getFromCache(fetchStore);
        if (cacheResult) {
            const { isCacheValid, isValid, status, responseCode, data } = cacheResult;
            if (isCacheValid) return { isValid, status, responseCode, data };
        }
    }

    // set isApiLoading true
    const queueId = !disableApiLoading ? addToApiLoading(settings.url) : null;
    let response;
    let lastFetchedAt;

    try {
        response = await window.fetch(url, {
            method,
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                ...(!disableAuth && { Authorization: `Bearer ${token}` }),
            },
            credentials,
            ...(body && { body: JSON.stringify(body) }),
        });

        lastFetchedAt = getDate("YYYY.oo.DD - HH:NN:SS").now.value();
    } catch (error) {
        errorHandler({
            disableNotifier,
            onError,
            status: (error.message || "Failed to fetch") + " for " + url,
            statusCode: error.status || 503,
            global_onError,
            killOnError,
            killOnErrorCallbackUrl,
            global_errorPageUrl,
            disableApiLoading,
            removeFromApiLoading,
            queueId,
        });
        return { isValid: false, status: error.status, statusCode: error.status, data: undefined };
    }

    const { data, meta, isValid, status, statusCode, json } = await handleResponse(
        response,
        fetchStore,
    );

    const pack = {
        data,
        meta,
        store: baseStore,
        isValid,
        status,
        statusCode,
        response: json,
        lastFetchedAt,
    };
    const { data: handledData, meta: handledMeta } =
        !data && !meta ? {} : handleData ? handleData(pack) : pack;
    pack.data = handledData;
    pack.meta = handledMeta;

    if (isValid) {
        onSuccess && onSuccess(pack);
        global_onSuccess && global_onSuccess(pack);

        if (useCache) addToCache(url, handledData);
    } else {
        errorHandler({
            disableNotifier,
            onError,
            status,
            statusCode,
            global_onError,
            killOnError,
            killOnErrorCallbackUrl,
            global_errorPageUrl,
            disableApiLoading,
            removeFromApiLoading,
            queueId,
        });
    }

    !disableApiLoading && removeFromApiLoading(queueId);
    return pack;
};

const errorHandler = (p = {}) => {
    const { navigate } = rrdStore?.getState() || {};
    const {
        disableNotifier,
        onError,
        status,
        statusCode,
        global_onError,
        killOnError,
        killOnErrorCallbackUrl,
        global_errorPageUrl,
        disableApiLoading,
        removeFromApiLoading,
        queueId,
    } = p;

    if (!disableNotifier) {
        addToNotifier({
            info: status,
            status: "error",
        });
    }

    onError?.({ status, statusCode, store: baseStore });
    global_onError?.({ status, statusCode, store: baseStore });

    if (killOnError && global_errorPageUrl) {
        navigate(
            global_errorPageUrl +
                "?status=" +
                status +
                "&statusCode=" +
                statusCode +
                (killOnErrorCallbackUrl ? "&callBack=" + killOnErrorCallbackUrl : ""),
        );
        clearLoading();
        clearApiLoading();
    }

    !disableApiLoading && removeFromApiLoading(queueId);
};

import { baseStore } from "../baseStore";
import { defaultMetaCatcher } from "./defaultMetaCatcher";
import { defaultDataCatcher } from "./defaultDataCatcher";
import { defaultErrorCatcher } from "./defaultErrorCatcher";
import { defaultResponseCodeCatcher } from "./defaultResponseCodeCatcher";
import { objToQueryString } from "../objToQueryString";

export const fetchStoreExe = (settings) => {
    const store = baseStore?.getState() || {};
    const { addToApiLoading, removeFromApiLoading, BASE_SETTINGS = {}, user } = store;
    const { fetchManager = {} } = BASE_SETTINGS;

    const {
        url,
        graphQuery = null,
        method = graphQuery ? "POST" : "GET",
        token = user?.token,
        params,
        paramsExporter,

        onError,
        onSuccess,
        disableAuth = false,
        useEnvUrl = true,
        credentials = useEnvUrl ? "include" : "omit",

        killOnError = fetchManager.killOnError || false,
        killOnErrorCallbackUrl = settings.killOnError || "/home",
        useCache = fetchManager.useCache || 0,
        disableApiLoading = fetchManager.disableApiLoading || false,
        handleData = fetchManager.handleData || undefined,
        errorCatcher = fetchManager.errorCatcher || defaultErrorCatcher,
        dataCatcher = fetchManager.dataCatcher || defaultDataCatcher,
        metaCatcher = fetchManager.metaCatcher || defaultMetaCatcher,
        responseCodeCatcher = fetchManager.responseCodeCatcher || defaultResponseCodeCatcher,

        disableNotifier = fetchManager.disableNotifier || false,
        getData,
    } = settings || {};

    const graphSplit = graphQuery?.split(" ")?.[0] || "";
    const graphMethod =
        graphSplit === "query" ? "query" : graphSplit === "mutation" ? "mutation" : undefined;

    const url1 = !url
        ? undefined
        : fetchManager.envUrl && useEnvUrl
          ? fetchManager.envUrl + url
          : url;

    const newParams =
        params && Object.keys(params).length > 0 && paramsExporter
            ? paramsExporter?.({ values: params })
            : { ...params };

    // prepare columns if params has columns data.
    // this function gets visible column ids.
    // in future, we can send names instead of ids.
    // currently BE doesn't ask this prop.
    if (newParams?.cols && newParams?.cols?.length > 0) {
        newParams.cols = newParams?.cols
            ?.filter((column) => column.visible)
            .map((column) => column.id);
    }
    // console.log("fetchParams", params);
    const url2 =
        url1 +
        (method === "GET" && newParams && Object.keys(newParams).length > 0
            ? "?" + objToQueryString(newParams)
            : "");

    return {
        addToApiLoading,
        body:
            !graphQuery && method === "GET"
                ? undefined
                : !graphQuery
                  ? newParams
                  : {
                        query: graphQuery,
                        variables: params,
                    },
        credentials,
        dataCatcher,
        metaCatcher,
        disableApiLoading,
        disableAuth,
        errorCatcher,
        global_envUrl: fetchManager.envUrl,
        global_errorPageUrl: fetchManager.errorPageUrl,
        global_onError: fetchManager.onError,
        global_onSuccess: fetchManager.onSuccess,
        graphMethod,
        graphQuery,
        handleData,
        killOnError,
        killOnErrorCallbackUrl,
        method,
        onError,
        onSuccess,
        params,
        removeFromApiLoading,
        responseCodeCatcher,
        token,
        url: url2,
        useCache,
        useEnvUrl,
        disableNotifier,
        getData,
    };
};

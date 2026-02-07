import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation, useParams, useSearchParams, useMatches } from "react-router-dom";
import { baseStore } from "../../@baseStore";
import { getClientData } from "../../getClientData";
import { createBaseDatePackage } from "../../@baseDate/createBaseDatePackage";
import { notifierFunctions } from "../notifier";
import { TEXT_LIBRARY } from "../../../constants/TEXT_LIBRARY";
import { useEventListener } from "../../useEventListener";
import { loadingApi } from "../loadingQueueManager";

export const GlobalDataProvider = ({ projectSettings, routes }) => {
    const {
        globalBaseStoreVariables = {},
        notifierSettings = {},
        baseDateSettings = {},
        iconsLibrary = {},
        idleManagerSettings = {},
        styledSettings = {},
        textLibrary: usersTextLibrary = {},
        baseFetchSettings = {},
    } = projectSettings || {};

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const matches = useMatches();
    const pathLanguage = matches?.[matches.length - 1]?.handle?.language;
    const searchParamsObj = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

    const navigateWithSearch = useCallback(
        (pathname, search) => {
            navigate({ pathname, search: search || location.search });
        },
        [navigate, location.search],
    );
    const global = baseStore.useGlobal();

    const getCD = useCallback(() => {
        return getClientData({
            breakpoints: styledSettings.breakpoints,
            maxAspRatio: styledSettings.maxAspRatio,
            minAspRatio: styledSettings.minAspRatio,
        });
    }, [styledSettings.breakpoints, styledSettings.maxAspRatio, styledSettings.minAspRatio]);

    useEffect(() => {
        const clientData = getCD();

        try {
            global.set({
                ...baseStore.globalData.get(),
                ...globalBaseStoreVariables,
                textLibrary: { ...TEXT_LIBRARY, ...(usersTextLibrary || {}) },
                isGlobalReady: true,
                _projectSettings: projectSettings,
                _routes: routes,
                language:
                    pathLanguage ??
                    clientData.language ??
                    globalBaseStoreVariables.defaultLanguage ??
                    "en",

                // loadingManager
                isLoading: false,
                isLoadingPage: false,
                isLoadingApi: false,
                _loadingManager: {
                    apiQueue: [],
                    api: loadingApi,
                },

                // baseFetch
                _baseFetchSettings: {
                    disableLoadingApi: false,
                    disableAuth: false,
                    getTokenFrom: null,
                    token: null,
                    cacheTime: 10,
                    envUrl: null,
                    ...baseFetchSettings,
                },

                // clientData
                _clientData: {
                    ...clientData,
                },

                // iconsLibrary
                _iconsLibrary: iconsLibrary,

                // notifier
                _notifier: {
                    killAfter: 10,
                    disable: false,
                    ...notifierSettings,
                    queue: [],
                    count: 0,
                    add: notifierFunctions.add,
                    remove: notifierFunctions.remove,
                    clear: notifierFunctions.clear,
                    onAdd: null,
                    onRemove: null,
                    onClear: null,
                },

                // baseDate
                _baseDate: {
                    defaultFormat: "DD/MM/YYYY",
                    firstDayOfWeek: 1,
                    timeZone: clientData.timeZone,
                    ...baseDateSettings,
                    package: createBaseDatePackage(),
                },

                // idleManager
                _idleManager: {
                    enabled: true,
                    allowedIdleTime: 30, // mins
                    onIdle: null,
                    onActive: null,
                    ...idleManagerSettings,
                },

                // reactRouterDom
                _reactRouterDom: {
                    navigate,
                    navigateWithSearch,
                    location,
                    params,
                    searchParams: searchParamsObj,
                },
            });
        } catch (error) {
            console.error("GlobalDataProvider: Failed to set globalData", error);
        }
    }, []);

    useEffect(() => {
        const currentGlobalData = baseStore.globalData.get();

        global.set({
            ...currentGlobalData,
            ...globalBaseStoreVariables,
            _projectSettings: projectSettings,
            _notifier: {
                ...currentGlobalData._notifier,
                ...notifierSettings,
            },
            _baseDate: {
                ...currentGlobalData._baseDate,
                ...baseDateSettings,
            },
            _iconsLibrary: iconsLibrary,
            _idleManager: {
                ...currentGlobalData._idleManager,
                ...idleManagerSettings,
            },
            language:
                pathLanguage ??
                currentGlobalData._clientData.language ??
                globalBaseStoreVariables.defaultLanguage ??
                "en",
        });
    }, [projectSettings]);
    useEffect(() => {
        baseStore.globalData.set((s) => {
            s._routes = routes;
        });
    }, [routes]);

    const updateClientData = () => {
        const generatedClientData = getCD();
        global.set((s) => {
            s._clientData = generatedClientData;
            s._baseDate.timeZone = generatedClientData.timeZone;
        });
    };
    useEventListener("resize", updateClientData, { getFirst: false });
    useEffect(updateClientData, [
        styledSettings.breakpoints,
        styledSettings.maxAspRatio,
        styledSettings.minAspRatio,
    ]);

    useEffect(() => {
        global.set((s) => {
            s._reactRouterDom = {
                navigate,
                navigateWithSearch,
                location,
                params,
                searchParams: searchParamsObj,
            };
        });
    }, [navigate, navigateWithSearch, location, params, searchParamsObj]);

    useEffect(() => {
        global.set((s) => {
            s._baseFetchSettings = baseFetchSettings;
        });
    }, [baseFetchSettings]);

    /* */
    return null;
};

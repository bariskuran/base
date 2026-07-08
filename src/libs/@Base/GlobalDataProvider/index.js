import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation, useParams, useSearchParams, useMatches } from "react-router-dom";
import { baseStore } from "../../baseStore";
import { getClientData } from "../../getClientData";
import { createBaseDatePackage } from "../../baseDate/createBaseDatePackage";
import { notifierFunctions } from "../../notifier/_Base";
import { TEXT_LIBRARY } from "../../../constants/TEXT_LIBRARY";
import { useEventListener } from "../../useEventListener";
import { loadingApi } from "../loadingQueueManager";
import { VALIDATION_RULES } from "../../../constants/VALIDATION_RULES";
import { useEffectAfterMount } from "../../useEffectAfterMount";
import {
    getIgnoreClientLanguage,
    getLanguageSettings,
    getPageLanguageFromMatches,
    resolveInitialLanguage,
} from "./resolveLanguage";

export const GlobalDataProvider = ({ projectSettings, routes, preparedRoutes = [] }) => {
    const {
        notifierSettings = {},
        baseDateSettings = {},
        iconsLibrary = {},
        idleManagerSettings = {},
        styledSettings = {},
        adminSettings = {},
        textLibrary: usersTextLibrary = {},
        baseFetchSettings = {},
        baseFormSettings = {},
        validationRules = {},
    } = projectSettings || {};

    const languageSettingsConfig = useMemo(
        () => getLanguageSettings(projectSettings),
        [projectSettings],
    );

    const ignoreClientLanguage = getIgnoreClientLanguage(projectSettings);

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const matches = useMatches();
    const searchParamsObj = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

    const pageLanguage = useMemo(
        () => getPageLanguageFromMatches(matches, languageSettingsConfig.languageList),
        [matches, languageSettingsConfig.languageList, location.pathname],
    );

    const navigateWithSearch = useCallback(
        (pathname, search) => {
            navigate({ pathname, search: search || location.search });
        },
        [navigate, location.search],
    );

    const getCD = useCallback(() => {
        return getClientData({
            breakpoints: styledSettings.breakpoints,
            maxAspRatio: styledSettings.maxAspRatio,
            minAspRatio: styledSettings.minAspRatio,
        });
    }, [styledSettings.breakpoints, styledSettings.maxAspRatio, styledSettings.minAspRatio]);

    useEffect(() => {
        const clientData = getCD();
        const currGlobalData = baseStore.globalData.get();

        try {
            baseStore.globalData.set({
                ...currGlobalData,
                languageSettings: languageSettingsConfig,
                textLibrary: { ...TEXT_LIBRARY, ...(usersTextLibrary || {}) },
                isGlobalReady: true,
                _projectSettings: projectSettings,
                _routes: routes,
                _preparedRoutes: preparedRoutes,
                sitemap: projectSettings?.rrdSettings?.SITEMAP,
                language: resolveInitialLanguage({
                    pageLanguage,
                    languageSettings: languageSettingsConfig,
                    clientData,
                    ignoreClientLanguage,
                }),


                isLoading: false,
                isLoadingPage: false,
                isLoadingApi: false,
                _loadingManager: {
                    apiQueue: [],
                    api: loadingApi,
                },


                _baseFetchSettings: {
                    disableLoadingApi: false,
                    disableAuth: false,
                    getTokenFrom: null,
                    token: null,
                    cacheTime: 10,
                    envUrl: null,
                    responseErrorPaths: [],
                    ...baseFetchSettings,
                },


                _clientData: {
                    ...clientData,
                },


                _iconsLibrary: iconsLibrary,


                _adminSettings: {
                    showInternalDs: false,
                    ...adminSettings,
                },


                _notifier: {
                    killAfter: 5,
                    closingDelay: 0.5,
                    disableNotifier: false,
                    disableAutoKill: false,
                    variant: null,
                    ...notifierSettings,
                    queue: [],
                    count: 0,
                    add: notifierFunctions.add,
                    remove: notifierFunctions.remove,
                    clear: notifierFunctions.clear,
                },


                _baseDate: {
                    defaultFormat: "DD/MM/YYYY",
                    firstDayOfWeek: 1,
                    timezone: clientData.timeZone,
                    ...baseDateSettings,
                    package: createBaseDatePackage(),
                },


                _idleManager: {
                    enabled: true,
                    allowedIdleTime: 30,
                    onIdle: null,
                    onActive: null,
                    ...idleManagerSettings,
                },


                _reactRouterDom: {
                    navigate,
                    navigateWithSearch,
                    location,
                    params,
                    searchParams: searchParamsObj,
                },


                _baseForm: {
                    ...baseFormSettings,
                },


                _validationRules: {
                    ...VALIDATION_RULES,
                    ...validationRules,
                },
            });
        } catch (error) {
            console.error("GlobalDataProvider: Failed to set globalData", error);
        }
    }, []);

    useEffectAfterMount(() => {
        const currentGlobalData = baseStore.globalData.get();

        baseStore.globalData.set({
            ...currentGlobalData,
            languageSettings: languageSettingsConfig,
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
            _adminSettings: {
                ...currentGlobalData._adminSettings,
                ...adminSettings,
            },
            _idleManager: {
                ...currentGlobalData._idleManager,
                ...idleManagerSettings,
            },
            language: resolveInitialLanguage({
                pageLanguage,
                languageSettings: languageSettingsConfig,
                clientData: currentGlobalData._clientData,
                ignoreClientLanguage,
            }),
        });
    }, [projectSettings, languageSettingsConfig, ignoreClientLanguage, pageLanguage]);

    useEffectAfterMount(() => {
        baseStore.globalData.set((s) => {
            delete s.languageList;
            delete s.defaultLanguage;
        });
    }, []);

    useEffectAfterMount(() => {
        baseStore.globalData.set((s) => {
            s._routes = routes;
            s._preparedRoutes = preparedRoutes;
            s.sitemap = projectSettings?.rrdSettings?.SITEMAP;
        });
    }, [routes, preparedRoutes, projectSettings?.rrdSettings?.SITEMAP]);

    const updateClientData = () => {
        const generatedClientData = getCD();
        baseStore.globalData.set((s) => {
            s._clientData = generatedClientData;
            s._baseDate.timezone = generatedClientData.timeZone;
        });
    };
    useEventListener("resize", updateClientData, { getFirst: false });
    useEffectAfterMount(updateClientData, [
        styledSettings.breakpoints,
        styledSettings.maxAspRatio,
        styledSettings.minAspRatio,
    ]);

    useEffectAfterMount(() => {
        baseStore.globalData.set((s) => {
            s._reactRouterDom = {
                navigate,
                navigateWithSearch,
                location,
                params,
                searchParams: searchParamsObj,
            };
        });
    }, [navigate, navigateWithSearch, location, params, searchParamsObj]);

    useEffectAfterMount(() => {
        baseStore.globalData.set((s) => {
            s._baseFetchSettings = {
                ...s._baseFetchSettings,
                ...baseFetchSettings,
            };
        });
    }, [baseFetchSettings]);

    useEffectAfterMount(() => {
        baseStore.globalData.set((s) => {
            s._baseFormSettings = {
                ...s._baseFormSettings,
                ...baseFormSettings,
            };
        });
    }, [baseFormSettings]);


    return null;
};

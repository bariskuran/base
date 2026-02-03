import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { baseStore } from "../../@baseStore";
import { getClientData } from "../../getClientData";
import { createBaseDatePackage } from "../../@baseDate/createBaseDatePackage";

import { notifierFunctions } from "../notifier";

export const GlobalDataProvider = ({ projectSettings, routes }) => {
    const {
        globalBaseStoreVariables = {},
        notifierSettings = {},
        baseDateSettings = {},
        iconsLibrary = {},
        idleManagerSettings = {},
        styledSettings = {},
    } = projectSettings || {};

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();

    const searchParamsObj = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

    const navigateWithSearch = useCallback(
        (pathname, search) => {
            navigate({ pathname, search: search || location.search });
        },
        [navigate, location.search],
    );

    // Add all project settings and routes to the global data
    useEffect(() => {
        const clientData = getClientData({
            breakpoints: styledSettings.breakpoints,
            maxAspRatio: styledSettings.maxAspRatio,
            minAspRatio: styledSettings.minAspRatio,
        });

        try {
            baseStore.globalData.set({
                ...baseStore.globalData.get(),
                ...globalBaseStoreVariables,
                _projectSettings: projectSettings,
                _routes: routes,

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
    }, [projectSettings, routes]);

    /* */
    return null;
};

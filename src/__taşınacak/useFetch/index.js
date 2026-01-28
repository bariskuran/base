import { useRef, useEffect } from "react";
import { useDebouncedFunction } from "../useDebouncedFunction";
import { useDashEffect } from "../useDashEffect";
import { useDS } from "../useDashStore";
import { fetch } from "../fetch";

export const useFetch = (fetchSettings = {}, hookSettings = {}) => {
    const { data, meta, statusCode, status, isValid, set, lastFetchedAt } = useDS({
        data: undefined,
        meta: undefined,
        statusCode: 0,
        status: "useFetch is loading...",
        isValid: "false",
        lastFetchedAt: null,
    });
    const { refreshTime = 10 } = hookSettings;
    const { getDataDependencies = [], play = true, url, params } = fetchSettings;
    const timeoutRef = useRef(null);

    /* GET DATA */
    const clearTimeoutRef = () => {
        clearTimeout(timeoutRef?.current);
        timeoutRef.current = null;
    };
    const handleFetch = async (overrideFetchSettings) => {
        const fetSet = {
            ...(fetchSettings || {}),
            ...(overrideFetchSettings || {}),
        };
        if (Object.keys(fetSet).length === 0) return;

        const { isValid, status, statusCode, data, meta, lastFetchedAt } = await fetch(fetSet);
        if (refreshTime) {
            timeoutRef.current = setTimeout(() => getData(), refreshTime * 60000);
        }

        set(() => ({ data, statusCode, status, isValid, meta, lastFetchedAt }));
    };

    const debouncedFetch = useDebouncedFunction(handleFetch, 1000);

    const getData = (overrideFetchSettings, settings = {}) => {
        clearTimeoutRef();
        if (!url || (play === false && !settings.skipPausing)) return;
        debouncedFetch(overrideFetchSettings || { params });
    };

    /* Clean timeout onMount Effect */
    useDashEffect(() => getData({ params }), [...getDataDependencies, play]);
    useEffect(() => {
        clearTimeoutRef();
        return () => clearTimeoutRef();
    }, []);

    /* Return */
    return {
        isValid,
        status,
        statusCode,
        data,
        meta,
        lastFetchedAt,
        getData: (overrideFetchSettings) => getData(overrideFetchSettings, { skipPausing: true }),
    };
};

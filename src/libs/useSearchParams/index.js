import { useMemo, useCallback } from "react";
import { baseStore } from "../baseStore";
import { manageSearchParams } from "../manageSearchParams";

export const useManageSearchParams = (options = {}) => {
    const searchKey = baseStore.useGlobal((s) => s._reactRouterDom?.location?.search ?? "");

    const [params, raw] = useMemo(() => {
        return manageSearchParams.get(options);
    }, [searchKey, options]);

    const set = useCallback(
        (objOrUpdater, settings) => {
            const next =
                typeof objOrUpdater === "function"
                    ? objOrUpdater({ ...(params || {}) })
                    : objOrUpdater;

            return manageSearchParams.set(next, {
                ...options,
                ...settings,
            });
        },
        [options, params],
    );

    const clear = useCallback((settings) => manageSearchParams.clear({ ...options, ...settings }), [
        options,
    ]);

    return useMemo(() => [params || {}, set, clear, raw], [params, set, clear, raw]);
};

import { useEffect, useMemo, useCallback, useRef } from "react";
import { baseStore } from "../@baseStore";
import { manageSearchParams } from "./manageSearchParams";
import { shallowEqual } from "../shallowEqual";

/**
 * React hook for managing typed, nested, optionally base64-encoded
 * URL search params via `manageSearchParams`.
 *
 * Returns decoded params directly on the object, plus helpers.
 *
 * @param {Object} [options]
 * @param {string[]} [options.pick]        Keys to pick from decoded params
 * @param {Object}   [options.defaults]    Default values if params are missing
 * @param {Object}   [options.bind]         Auto-sync local values to URL
 * @param {boolean}  [options.replace=true] Use history.replace instead of push
 * @param {number}   [options.maxLength=0]  Max allowed query length (0 = unlimited)
 *
 * @returns {Object} An object containing decoded params and helpers:
 *   - decoded params as direct properties
 *   - set(obj, options)
 *   - clear(options)
 *   - raw (decoded raw query string)
 *
 * @example
 * const { a, b, set, clear } = useManageSearchParams();
 * const { set, raw, clear, ...searchParams} = useManageSearchParams();
 *
 * @example
 * const { page, filter } = useManageSearchParams({
 *   pick: ["page", "filter"],
 *   defaults: { page: 1 },
 * });
 *
 * @example
 * const { set } = useManageSearchParams({
 *   bind: { page, filter },
 *   replace: true,
 * });
 */
export const useManageSearchParams = (options = {}) => {
    const { pick, defaults, bind, replace = true, maxLength = 0 } = options;

    const rrd = baseStore.useReactRouterDom() || {};
    const searchKey = rrd.location?.search || "";

    const [decodedAll, raw] = useMemo(() => {
        return manageSearchParams.get();
    }, [searchKey]);

    const decoded = useMemo(() => {
        const base = { ...(defaults || {}), ...(decodedAll || {}) };
        if (!Array.isArray(pick) || pick.length === 0) return base;

        const out = {};
        for (const k of pick) out[k] = base[k];
        return out;
    }, [decodedAll, defaults, pick]);

    const set = useCallback(
        (objOrUpdater, settings) => {
            return manageSearchParams.set(objOrUpdater, {
                replace,
                maxLength,
                ...settings,
            });
        },
        [replace, maxLength],
    );

    const clear = useCallback(
        (settings) => {
            return manageSearchParams.clear({
                replace,
                ...settings,
            });
        },
        [replace],
    );

    const lastBindRef = useRef(null);
    useEffect(() => {
        if (!bind) return;

        const next = { ...(decoded || {}), ...(bind || {}) };

        const prevBind = lastBindRef.current;
        lastBindRef.current = bind;

        if (prevBind && shallowEqual(prevBind, bind)) return;
        if (shallowEqual(decoded, next)) return;

        manageSearchParams.set(next, { replace, maxLength });
    }, [bind, decoded, replace, maxLength]);

    return useMemo(
        () => ({
            ...(decoded || {}),
            set,
            clear,
            raw,
        }),
        [decoded, set, clear, raw],
    );
};

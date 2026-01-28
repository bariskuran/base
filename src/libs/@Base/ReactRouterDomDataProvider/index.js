import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { baseStore } from "../../@baseStore";

export const ReactRouterDomDataProvider = () => {
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

    useEffect(() => {
        baseStore.reactRouterDomData.set({
            navigate,
            navigateWithSearch,
            location,
            params,
            searchParams: searchParamsObj,
        });
    }, [navigate, navigateWithSearch, location, params, searchParamsObj]);

    return null;
};

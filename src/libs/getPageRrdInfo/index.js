import { baseStore } from "../baseStore";
import { typeOf } from "../typeOf";

const trimSegment = (segment) => String(segment ?? "").replace(/^\/+|\/+$/g, "");

export const normalizeAppPathname = (path) => {
    if (path == null || path === "") return "/";
    const trimmed = String(path).trim();
    if (trimmed === "/") return "/";
    const segment = trimSegment(trimmed);
    return segment ? `/${segment}` : "/";
};

export const pathnamesMatch = (a, b) => normalizeAppPathname(a) === normalizeAppPathname(b);

export const findPreparedRouteByPathname = (preparedRoutes, pathname) => {
    if (!Array.isArray(preparedRoutes) || pathname == null) return null;
    const target = normalizeAppPathname(pathname);
    return (
        preparedRoutes.find((route) => {
            if (pathnamesMatch(route.path, target) || pathnamesMatch(`/${route.path}`, target)) {
                return true;
            }
            const relatives = route?.handle?.relatives;
            if (relatives && typeOf(relatives) === "object") {
                return Object.values(relatives).some((relativePath) =>
                    pathnamesMatch(relativePath, target),
                );
            }
            return false;
        }) ?? null
    );
};

/**
 * Current page RRD info from globalData (_preparedRoutes, _reactRouterDom, language).
 * @param {string} [pathnameOverride] — defaults to active location pathname
 */
export const getPageRrdInfo = (pathnameOverride) => {
    const gd = baseStore?.globalData?.get?.() || {};
    const pathname =
        pathnameOverride ?? gd._reactRouterDom?.location?.pathname ?? "/";
    const preparedRoutes = gd._preparedRoutes ?? [];
    const language = gd.language ?? gd.languageSettings?.defaultLanguage ?? "en";
    const route = findPreparedRouteByPathname(preparedRoutes, pathname);
    const handle = route?.handle ?? null;

    return {
        pathname: normalizeAppPathname(pathname),
        language,
        route,
        handle,
        relatives: handle?.relatives ?? null,
        categories: handle?.categories ?? null,
        languageRoute: gd._languageRoute ?? null,
        preparedRoutes,
        preparedRoutesForLanguage: preparedRoutes.filter((r) => r.handle?.language === language),
    };
};

import { typeOf } from "../../typeOf";

const trimSegment = (segment) => String(segment ?? "").replace(/^\/+|\/+$/g, "");

const resolvePrefixSegment = (prefixPath, language) => {
    if (prefixPath == null || prefixPath === "") return null;
    if (typeof prefixPath === "string") {
        const trimmed = trimSegment(prefixPath);
        return trimmed || null;
    }
    if (typeOf(prefixPath) === "object") {
        const value = prefixPath[language] ?? prefixPath.en ?? null;
        const trimmed = trimSegment(value);
        return trimmed || null;
    }
    return null;
};

/** RRD path segment(s) without leading slash; relatives use a leading slash. */
export const joinRouteSegments = (...segments) => {
    const parts = segments.map(trimSegment).filter(Boolean);
    return parts.join("/");
};

export const joinRoutePathname = (...segments) => {
    const joined = joinRouteSegments(...segments);
    return joined ? `/${joined}` : "/";
};

const isNavGroup = (node) =>
    Array.isArray(node?.children) && node.children.length > 0 && !node.Component;

const collectLanguagesFromPath = (path) => {
    if (typeOf(path) === "object") return Object.keys(path);
    return [];
};

const collectLanguagesForRoute = (pagePath, categories) => {
    if (typeOf(pagePath) === "object") return collectLanguagesFromPath(pagePath);
    const languages = new Set(["en"]);
    categories.forEach((category) => {
        if (typeOf(category.prefixPath) === "object") {
            Object.keys(category.prefixPath).forEach((lang) => languages.add(lang));
        }
    });
    return [...languages];
};

const buildRelativesMap = (pagePath, categories) => {
    const pagePathIsObject = typeOf(pagePath) === "object";
    const languages = collectLanguagesForRoute(pagePath, categories);

    const relatives = {};
    for (const language of languages) {
        const pageSegment = pagePathIsObject ? pagePath[language] : pagePath;
        const prefixSegments = categories.map((category) =>
            resolvePrefixSegment(category.prefixPath, language),
        );
        relatives[language] = joinRoutePathname(...prefixSegments, pageSegment);
    }
    return relatives;
};

const pushPreparedRoute = (routes, routeConfig) => {
    routes.push(routeConfig);
};

const prepareRouteNode = (routes, route, context) => {
    if (!route) return;

    const { path, handle, children, title, prefixPath, ...rest } = route;
    const { title: handleTitle, pageTitle, ...restHandle } = handle || {};
    const mergedTitle = handleTitle ?? title;

    if (isNavGroup(route)) {
        const categoryEntry = {
            ...(mergedTitle != null ? { title: mergedTitle } : {}),
            ...(prefixPath != null ? { prefixPath } : {}),
        };
        const nextContext = {
            categories: [...context.categories, categoryEntry],
        };
        route.children.forEach((child) => prepareRouteNode(routes, child, nextContext));
        return;
    }

    const categories = context.categories;

    if (typeOf(path) === "object") {
        const relatives = buildRelativesMap(path, categories);
        Object.keys(path).forEach((language) => {
            const routePath = joinRouteSegments(
                ...categories.map((category) => resolvePrefixSegment(category.prefixPath, language)),
                path[language],
            );
            pushPreparedRoute(routes, {
                ...rest,
                path: routePath,
                handle: {
                    language,
                    relatives,
                    ...(categories.length > 0 ? { categories: [...categories] } : {}),
                    ...(mergedTitle?.[language] != null ? { title: mergedTitle[language] } : {}),
                    ...(pageTitle?.[language] != null ? { pageTitle: pageTitle[language] } : {}),
                    ...restHandle,
                },
            });
        });
        return;
    }

    if (path === "/" || path === "") {
        pushPreparedRoute(routes, {
            ...rest,
            path: path === "" ? "/" : path,
            handle: {
                ...(categories.length > 0 ? { categories: [...categories] } : {}),
                ...restHandle,
            },
        });
        return;
    }

    if (path != null && path !== "") {
        const languages = collectLanguagesForRoute(path, categories);
        const primaryLanguage = languages[0] ?? "en";
        const routePath = joinRouteSegments(
            ...categories.map((category) =>
                resolvePrefixSegment(category.prefixPath, primaryLanguage),
            ),
            path,
        );
        const relatives = buildRelativesMap(path, categories);
        pushPreparedRoute(routes, {
            ...rest,
            path: routePath || trimSegment(path),
            handle: {
                relatives,
                ...(categories.length > 0 ? { categories: [...categories] } : {}),
                ...restHandle,
                ...(typeOf(mergedTitle) === "object" ? {} : mergedTitle != null ? { title: mergedTitle } : {}),
            },
        });
        return;
    }

    pushPreparedRoute(routes, route);
};

/**
 * Flattens SITEMAP (pages + nested category groups) into RRD-ready route objects.
 * Category prefixPath stacks per level; missing prefix at a level adds no segment.
 */
export const prepareRoutes = (arr = []) => {
    const routes = [];
    if (!Array.isArray(arr)) return routes;
    arr.forEach((route) => prepareRouteNode(routes, route, { categories: [] }));
    return routes;
};

/**
 * Builds the app route tree passed to createBrowserRouter (Layout wrapper + prepared children).
 */
export const buildAppRoutes = (rrdSettings = {}) => {
    const { Layout, SITEMAP = [], overridePrepareRoutes } = rrdSettings;
    const prepare =
        typeof overridePrepareRoutes === "function" ? overridePrepareRoutes : prepareRoutes;
    const preparedRoutes = prepare(SITEMAP);

    if (!Layout) return { appRoutes: preparedRoutes, preparedRoutes };

    return {
        appRoutes: [{ Component: Layout, children: preparedRoutes }],
        preparedRoutes,
    };
};

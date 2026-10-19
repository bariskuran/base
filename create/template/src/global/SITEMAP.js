import Home from "views/home/_route";

export const SITEMAP = [Home];

const flattenRoutes = (routes) =>
    routes.flatMap((route) => {
        const childRoutes = route.children ? flattenRoutes(route.children) : [];
        return route.handle?.id ? [route, ...childRoutes] : childRoutes;
    });

const createRouteMapById = (routes) =>
    flattenRoutes(routes).reduce((acc, route) => {
        if (!acc[route.handle.id]) acc[route.handle.id] = route;
        return acc;
    }, {});

export const ROUTE_BY_ID = createRouteMapById(SITEMAP);

export const ROUTE_HANDLE_BY_ID = Object.fromEntries(
    Object.entries(ROUTE_BY_ID).map(([id, route]) => [id, route.handle]),
);

export const getRouteHandlesByIds = (ids) => {
    if (!ids) return null;
    return ids.map((id) => ROUTE_HANDLE_BY_ID[id]).filter(Boolean);
};

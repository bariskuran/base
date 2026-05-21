import { useCallback, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const normalizePathname = (pathname) =>
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

const hrefUnderBase = (basePath, pathSegment) => {
    const base = String(basePath ?? "/").replace(/\/+$/, "") || "/";
    if (pathSegment == null || pathSegment === "") return base;
    const seg = String(pathSegment).replace(/^\//, "");
    return `${base}/${seg}`;
};

export const useRevealNavItem = ({
    pathname: pathnameOverride,
    links = [],
    basePath = "/",
    getPathFromLink = (link) => link[1],
    block = "center",
    inline = "nearest",
    behavior = "smooth",
    extraDeps = [],
}) => {
    const { pathname: routePathname } = useLocation();
    const pathname = pathnameOverride ?? routePathname;
    const activeNavItemRef = useRef(null);

    const isActive = useCallback(
        (item) => {
            const seg = getPathFromLink(item);
            const href = hrefUnderBase(basePath, seg);
            return normalizePathname(pathname) === normalizePathname(href);
        },
        [pathname, basePath, getPathFromLink],
    );

    useLayoutEffect(() => {
        const el = activeNavItemRef.current;
        if (!el) return;

        const scroll = () => {
            el.scrollIntoView({ block, inline, behavior });
        };

        scroll();

        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            scroll();
            raf2 = requestAnimationFrame(scroll);
        });

        return () => {
            cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
        };
    }, [pathname, links, block, inline, behavior, basePath, getPathFromLink, ...extraDeps]);

    return [isActive, activeNavItemRef];
};

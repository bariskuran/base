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

const scrollWithinParent = (el, scrollParent, { block, behavior }) => {
    const elRect = el.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();

    let delta = 0;

    if (block === "center") {
        delta = elRect.top - parentRect.top - (parentRect.height - elRect.height) / 2;
    } else if (block === "start") {
        delta = elRect.top - parentRect.top;
    } else if (block === "end") {
        delta = elRect.bottom - parentRect.bottom;
    } else if (elRect.top < parentRect.top) {
        delta = elRect.top - parentRect.top;
    } else if (elRect.bottom > parentRect.bottom) {
        delta = elRect.bottom - parentRect.bottom;
    } else {
        return;
    }

    if (Math.abs(delta) < 1) return;

    const maxScroll = Math.max(0, scrollParent.scrollHeight - scrollParent.clientHeight);
    const nextScrollTop = Math.min(maxScroll, Math.max(0, scrollParent.scrollTop + delta));

    if (behavior === "smooth") {
        scrollParent.scrollTo({ top: nextScrollTop, behavior: "smooth" });
        return;
    }

    scrollParent.scrollTop = nextScrollTop;
};

const revealNavItem = (el, { scrollRootRef, block, inline, behavior }) => {
    const scrollRoot = scrollRootRef?.current;

    if (scrollRoot) {
        scrollWithinParent(el, scrollRoot, { block, behavior });
        return;
    }

    el.scrollIntoView({ block, inline, behavior });
};

export const useRevealNavItem = ({
    pathname: pathnameOverride,
    links = [],
    basePath = "/",
    getPathFromLink = (link) => link[1],
    scrollRootRef,
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

        const run = () => revealNavItem(el, { scrollRootRef, block, inline, behavior });

        run();

        const raf = requestAnimationFrame(run);

        return () => cancelAnimationFrame(raf);
    }, [pathname, links, scrollRootRef, block, inline, behavior, basePath, getPathFromLink, ...extraDeps]);

    return [isActive, activeNavItemRef];
};

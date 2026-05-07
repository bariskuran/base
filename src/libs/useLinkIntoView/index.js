import { useCallback, useLayoutEffect, useRef } from "react";

const normalizePathname = (pathname) =>
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

const hrefUnderBase = (basePath, pathSegment) => {
    const base = String(basePath ?? "/").replace(/\/+$/, "") || "/";
    if (pathSegment == null || pathSegment === "") return base;
    const seg = String(pathSegment).replace(/^\//, "");
    return `${base}/${seg}`;
};

const defaultGetPathFromLink = (link) => link[1];

/**
 * @param {object} options
 * @param {string} options.pathname — genelde useLocation().pathname
 * @param {unknown[]} options.links — eşleşme ve effect bağımlılığı (örn. sıralı nav listesi)
 * @param {string} [options.basePath="/design-system"] — pathSegment boşsa yalnızca base (index)
 * @param {(link: unknown) => unknown} [options.getPathFromLink] — varsayılan `link[1]` (sitemap satırı)
 * @param {ScrollLogicalPosition} [options.block="center"]
 * @param {ScrollLogicalPosition} [options.inline="nearest"]
 * @param {ScrollBehavior} [options.behavior="smooth"]
 * @param {unknown[]} [options.extraDeps=[]] — ek useLayoutEffect bağımlılıkları
 * @returns {[ (item: unknown) => boolean, React.MutableRefObject<HTMLElement | null> ]}
 */
export const useLinkIntoView = ({
    pathname,
    links = [],
    basePath = "/design-system",
    getPathFromLink = defaultGetPathFromLink,
    block = "center",
    inline = "nearest",
    behavior = "smooth",
    extraDeps = [],
}) => {
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

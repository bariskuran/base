export const isWindowLike = (target) =>
    !target ||
    target === window ||
    target === document.body ||
    target === document.documentElement;

export const isScrollable = (el) => {
    if (!el || el.nodeType !== 1 || typeof window === "undefined") return false;

    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    const scrollableY =
        ["auto", "scroll", "overlay"].includes(overflowY) && el.scrollHeight > el.clientHeight;
    const scrollableX =
        ["auto", "scroll", "overlay"].includes(overflowX) && el.scrollWidth > el.clientWidth;

    return scrollableY || scrollableX;
};

const hasScrollOverflowStyle = (el) => {
    if (!el || el.nodeType !== 1 || typeof window === "undefined") return false;

    const scrollOverflow = (overflowY, overflowX) =>
        ["auto", "scroll", "overlay"].includes(overflowY) ||
        ["auto", "scroll", "overlay"].includes(overflowX);

    const style = window.getComputedStyle(el);
    if (scrollOverflow(style.overflowY, style.overflowX)) return true;

    return (
        scrollOverflow(el.style.overflowY, el.style.overflowX) ||
        ["auto", "scroll", "overlay"].includes(el.style.overflow)
    );
};

const isDocumentScrollable = () => {
    if (typeof document === "undefined" || typeof window === "undefined") return false;

    const docEl = document.documentElement;
    const body = document.body;

    return (
        isScrollable(docEl) ||
        isScrollable(body) ||
        Math.max(docEl.scrollHeight, body.scrollHeight) > window.innerHeight
    );
};

export const isDocumentScrollElement = (el) =>
    !!el && (el === document.body || el === document.documentElement);

export const getDocumentScrollElement = () => {
    if (typeof document === "undefined") return null;

    const { scrollingElement, documentElement, body } = document;

    if (scrollingElement?.nodeType === 1) return scrollingElement;
    if (isScrollable(body)) return body;
    if (isScrollable(documentElement)) return documentElement;

    return body || documentElement || null;
};

export const normalizeScrollSource = (source) => {
    if (source == null || source === window) return getDocumentScrollElement();
    return source;
};

export const getScrollParent = (el) => {
    if (!el) return getDocumentScrollElement();

    let node = el.parentElement;
    let overflowCandidate = null;

    while (node) {
        if (isScrollable(node)) return node;

        if (!overflowCandidate && hasScrollOverflowStyle(node)) {
            overflowCandidate = node;
        }

        if (node === document.documentElement) break;
        node = node.parentElement;
    }

    if (overflowCandidate) {
        if (isScrollable(overflowCandidate)) return overflowCandidate;

        if (!isDocumentScrollable()) return overflowCandidate;
    }

    if (isDocumentScrollable()) return getDocumentScrollElement();

    return null;
};

export const readScrollTop = (source) => {
    const el = normalizeScrollSource(source);
    if (!el) return 0;

    if (el === document.body || el === document.documentElement) {
        return Math.max(
            document.documentElement?.scrollTop ?? 0,
            document.body?.scrollTop ?? 0,
            window.scrollY ?? 0,
        );
    }

    return el.scrollTop ?? 0;
};

export const readScrollLeft = (source) => {
    const el = normalizeScrollSource(source);
    if (!el) return 0;

    if (el === document.body || el === document.documentElement) {
        return Math.max(
            document.documentElement?.scrollLeft ?? 0,
            document.body?.scrollLeft ?? 0,
            window.scrollX ?? 0,
        );
    }

    return el.scrollLeft ?? 0;
};

export const readScrollSize = (source) => {
    const el = normalizeScrollSource(source);
    if (!el) return { width: 0, height: 0 };

    if (el === document.body || el === document.documentElement) {
        const docEl = document.documentElement;
        const body = document.body;

        return {
            width: Math.max(
                docEl?.scrollWidth ?? 0,
                body?.scrollWidth ?? 0,
                docEl?.offsetWidth ?? 0,
                body?.offsetWidth ?? 0,
            ),
            height: Math.max(
                docEl?.scrollHeight ?? 0,
                body?.scrollHeight ?? 0,
                docEl?.offsetHeight ?? 0,
                body?.offsetHeight ?? 0,
            ),
        };
    }

    return {
        width: Math.round(el.scrollWidth),
        height: Math.round(el.scrollHeight),
    };
};

export const attachScrollListener = (source, handler, { passive = true } = {}) => {
    const el = normalizeScrollSource(source);
    if (!el) return () => {};

    const options = { passive };


    if (typeof window !== "undefined" && isDocumentScrollElement(el)) {
        window.addEventListener("scroll", handler, options);
        return () => window.removeEventListener("scroll", handler, options);
    }

    el.addEventListener("scroll", handler, options);
    return () => el.removeEventListener("scroll", handler, options);
};

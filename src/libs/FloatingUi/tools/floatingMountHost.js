const BODY_LAYER_ID = "__floatingUiPortalLayer";

const scrollLike = (style) =>
    /(auto|scroll|overlay)/.test(style.overflow) ||
    /(auto|scroll|overlay)/.test(style.overflowX) ||
    /(auto|scroll|overlay)/.test(style.overflowY);

const inferMountRoot = (triggerEl) => {
    let el = triggerEl.parentElement;
    while (el) {
        if (scrollLike(getComputedStyle(el))) return el;
        if (el === document.documentElement) break;
        el = el.parentElement;
    }
    return document.body;
};

export const pickFloatingMountRoot = (triggerEl, resolveFloatingMount) => {
    if (typeof document === "undefined") return null;
    if (!triggerEl) return document.body;
    if (typeof resolveFloatingMount === "function") {
        const resolved = resolveFloatingMount(triggerEl);
        if (resolved instanceof HTMLElement) return resolved;
    }
    return inferMountRoot(triggerEl);
};

const hostStyles = () => ({
    position: "relative",
    width: "0px",
    height: "0px",
    overflow: "visible",
    pointerEvents: "none",
    margin: "0",
    padding: "0",
    border: "0",
    boxSizing: "border-box",
});

const mountRootRefCount = new Map();

const refCountKey = (mountRoot) => (mountRoot === document.body ? "__body__" : mountRoot);

export const ensureFloatingMountHost = (mountRoot) => {
    if (typeof document === "undefined" || !mountRoot) return null;

    if (mountRoot === document.body) {
        let el = document.getElementById(BODY_LAYER_ID);
        if (el && document.body.contains(el)) {
            Object.assign(el.style, hostStyles());
            el.style.setProperty("overflow", "visible", "important");
            return el;
        }
        el = document.createElement("div");
        el.id = BODY_LAYER_ID;
        el.setAttribute("aria-hidden", "true");
        Object.assign(el.style, hostStyles());
        el.style.setProperty("overflow", "visible", "important");
        document.body.insertBefore(el, document.body.firstChild);
        return el;
    }

    let host = mountRoot.querySelector(":scope > [data-floating-mount-host]");
    if (host) {
        Object.assign(host.style, hostStyles());
        host.style.setProperty("overflow", "visible", "important");
        return host;
    }
    host = document.createElement("div");
    host.setAttribute("data-floating-mount-host", "");
    Object.assign(host.style, hostStyles());
    host.style.setProperty("overflow", "visible", "important");
    mountRoot.insertBefore(host, mountRoot.firstChild);
    return host;
};

const removeFloatingHostFromDom = (mountRoot) => {
    if (!mountRoot) return;
    if (mountRoot === document.body) {
        document.getElementById(BODY_LAYER_ID)?.remove();
        return;
    }
    mountRoot.querySelector(":scope > [data-floating-mount-host]")?.remove();
};

/** Açık FloatingUi sayısını artırır; host yoksa oluşturur. */
export const acquireFloatingMountHost = (mountRoot) => {
    const host = ensureFloatingMountHost(mountRoot);
    if (!host) return null;
    const k = refCountKey(mountRoot);
    mountRootRefCount.set(k, (mountRootRefCount.get(k) || 0) + 1);
    return host;
};

/** Son kullanımda host düğümünü DOM'dan kaldırır. */
export const releaseFloatingMountHost = (mountRoot) => {
    if (!mountRoot) return;
    const k = refCountKey(mountRoot);
    const cur = mountRootRefCount.get(k) ?? 0;
    if (cur <= 0) return;
    const next = cur - 1;
    if (next <= 0) {
        mountRootRefCount.delete(k);
        removeFloatingHostFromDom(mountRoot);
    } else {
        mountRootRefCount.set(k, next);
    }
};

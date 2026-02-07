import { sleep } from "../../sleep";

export const raf = () => new Promise((r) => requestAnimationFrame(() => r()));

export const withTimeout = async (promise, ms) => {
    let t;
    try {
        return await Promise.race([
            promise,
            new Promise((resolve) => {
                t = setTimeout(() => resolve(true), ms);
            }),
        ]);
    } finally {
        if (t) clearTimeout(t);
    }
};

export const waitForFonts = () => {
    const fonts = typeof document !== "undefined" ? document.fonts : null;
    if (!fonts || typeof fonts.ready?.then !== "function") return Promise.resolve(true);
    return fonts.ready.then(
        () => true,
        () => true,
    );
};

export const waitForImages = () => {
    if (typeof document === "undefined") return Promise.resolve(true);

    const imgs = Array.from(document.querySelectorAll("img"));
    if (imgs.length === 0) return Promise.resolve(true);

    const isDone = (img) => img.complete;
    const allDone = () => imgs.every(isDone);

    if (allDone()) return Promise.resolve(true);

    return new Promise((resolve) => {
        let active = true;
        const handlers = new Map();

        const cleanup = () => {
            for (const [img, handler] of handlers) {
                img.removeEventListener("load", handler);
                img.removeEventListener("error", handler);
            }
            handlers.clear();
        };

        const finishOnce = () => {
            if (!active) return;
            active = false;
            cleanup();
            resolve(true);
        };

        const onAny = () => {
            if (allDone()) finishOnce();
        };

        for (const img of imgs) {
            const handler = () => onAny();
            handlers.set(img, handler);
            img.addEventListener("load", handler, { passive: true });
            img.addEventListener("error", handler, { passive: true });
        }
    });
};

export const waitForVideos = () => {
    if (typeof document === "undefined") return Promise.resolve(true);

    const videos = Array.from(document.querySelectorAll("video"));
    if (videos.length === 0) return Promise.resolve(true);

    const isDone = (v) => {
        if (v.readyState >= 1) return true;
        return false;
    };

    const allDone = () => videos.every(isDone);
    if (allDone()) return Promise.resolve(true);

    return new Promise((resolve) => {
        let active = true;
        const handlers = new Map();

        const cleanup = () => {
            for (const [v, handler] of handlers) {
                v.removeEventListener("loadedmetadata", handler);
                v.removeEventListener("canplay", handler);
                v.removeEventListener("error", handler);
            }
            handlers.clear();
        };

        const finishOnce = () => {
            if (!active) return;
            active = false;
            cleanup();
            resolve(true);
        };

        const onAny = () => {
            if (allDone()) finishOnce();
        };

        for (const v of videos) {
            const handler = () => onAny();
            handlers.set(v, handler);
            v.addEventListener("loadedmetadata", handler, { passive: true });
            v.addEventListener("canplay", handler, { passive: true });
            v.addEventListener("error", handler, { passive: true });
        }
    });
};

export const extractBgUrls = () => {
    if (typeof document === "undefined" || typeof window === "undefined") return [];

    const urlRegex = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

    const urls = new Set();
    const nodes = Array.from(document.querySelectorAll("*"));

    for (const el of nodes) {
        const style = window.getComputedStyle(el);
        const bg = style?.backgroundImage;
        if (!bg || bg === "none") continue;

        let m;
        while ((m = urlRegex.exec(bg))) {
            const u = m[2];
            if (!u) continue;
            urls.add(u);
        }
    }

    return Array.from(urls);
};

export const preloadImageUrl = (url) =>
    new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
        img.src = url;
    });

export const waitForBackgroundImages = () => {
    const urls = extractBgUrls();
    if (!urls.length) return Promise.resolve(true);
    return Promise.all(urls.map(preloadImageUrl)).then(() => true);
};

export const getLottieContainers = () => {
    if (typeof document === "undefined") return [];
    return Array.from(
        document.querySelectorAll(
            '[data-lottie], [data-lottie-player], lottie-player, .lottie, [class*="lottie"]',
        ),
    );
};

export const isLottieRendered = (el) => {
    if (!el || !(el instanceof Element)) return true;
    return Boolean(el.querySelector("svg, canvas"));
};

export const waitForLottieBestEffort = async () => {
    const containers = getLottieContainers();
    if (!containers.length) return true;
    const maxMs = 4000;
    const start = Date.now();
    await raf();
    await raf();

    while (Date.now() - start < maxMs) {
        const allDone = containers.every(isLottieRendered);
        if (allDone) return true;
        await sleep(50);
    }

    return true;
};

import { useEffect, useMemo, useRef, useState } from "react";
import { baseStore } from "../baseStore";
import { getText as t } from "../getText";
import { useCatalogImage } from "../useCatalogImage";

const DEV_WARNING_PREFIX = "[base/Image]";

const warn = (message) => {
    if (!baseStore.globalData.get?.()?.isDevMode) return;
    console.warn(`${DEV_WARNING_PREFIX} ${message}`);
};

const getWindow = () => (typeof window === "undefined" ? null : window);

const toNumber = (value) => {
    if (value == null || value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
};

const getNaturalWidth = (entry = {}) =>
    toNumber(entry.naturalWidth ?? entry.dimensionWidth ?? entry.width ?? entry.w);

const getNaturalHeight = (entry = {}) =>
    toNumber(entry.naturalHeight ?? entry.dimensionHeight ?? entry.height ?? entry.h);

const normalizeSetEntry = (value, key) => {
    if (!value) return null;

    if (typeof value === "string") {
        return {
            key: String(key),
            src: value,
            hasDimensions: false,
        };
    }

    if (typeof value !== "object") return null;

    const src = value.src || value.file || value.url;
    if (!src) return null;

    const naturalWidth = getNaturalWidth(value);
    const naturalHeight = getNaturalHeight(value);

    return {
        ...value,
        key: value.key || String(key),
        src,
        naturalWidth,
        naturalHeight,
        hasDimensions: !!naturalWidth,
    };
};

const normalizeSet = (set) => {
    if (!set) return [];

    if (Array.isArray(set)) {
        return set
            .map((value, index) => normalizeSetEntry(value, index))
            .filter(Boolean);
    }

    if (typeof set === "object") {
        return Object.entries(set)
            .map(([key, value]) => normalizeSetEntry(value, key))
            .filter(Boolean);
    }

    return [];
};

const sortByWidth = (items) => {
    return [...items].sort((a, b) => {
        const aWidth = getNaturalWidth(a) ?? Number.MAX_SAFE_INTEGER;
        const bWidth = getNaturalWidth(b) ?? Number.MAX_SAFE_INTEGER;
        return aWidth - bWidth;
    });
};

const getAspectRatio = (entry) => {
    const naturalWidth = getNaturalWidth(entry);
    const naturalHeight = getNaturalHeight(entry);
    if (!naturalWidth || !naturalHeight) return null;
    return `${naturalWidth} / ${naturalHeight}`;
};

const getSmallestPreview = (items) => {
    const withSize = items.filter((item) => Number.isFinite(Number(item.sizeBytes)));
    if (withSize.length > 0) {
        return [...withSize].sort((a, b) => Number(a.sizeBytes) - Number(b.sizeBytes))[0];
    }
    return sortByWidth(items)[0] || null;
};

const getBestByTargetWidth = (items, targetWidth) => {
    if (items.length === 0) return null;
    const sorted = sortByWidth(items);
    if (!targetWidth) return sorted[sorted.length - 1];
    return sorted.find((item) => getNaturalWidth(item) >= targetWidth) || sorted[sorted.length - 1];
};

const resolveDisplayWidth = ({ explicitWidth, measuredWidth, clientData }) => {
    const numericWidth = toNumber(explicitWidth);
    if (numericWidth) return numericWidth;
    if (measuredWidth) return measuredWidth;
    return clientData?.winW || clientData?.windowWidth || null;
};

const hasUsableDimensions = (items) => {
    return items.length > 0 && items.every((item) => !!getNaturalWidth(item));
};

const getCatalogSource = (catalogImage) => catalogImage?.imageSet || null;

export const useVars = ({
    src,
    externalSet,
    catalogSet,
    alt,
    variant,
    responsive = true,
    progressive = true,
    loadInViewport = false,
    loadingAnimation = "pulse",
    width,
    height,
    w,
    h,
    onLoad,
}) => {
    const wrapperRef = useRef(null);
    const catalogImage = useCatalogImage(catalogSet);
    const [measuredWidth, setMeasuredWidth] = useState(null);
    const [isInViewport, setIsInViewport] = useState(false);
    const [readySrc, setReadySrc] = useState(null);
    const clientData = baseStore.useGlobal((s) => s._clientData);

    const source = useMemo(() => {
        if (catalogSet) return { type: "catalogSet", set: getCatalogSource(catalogImage) };
        if (externalSet) return { type: "externalSet", set: externalSet };
        return { type: "src", src };
    }, [catalogSet, catalogImage, externalSet, src]);

    const normalizedItems = useMemo(() => normalizeSet(source.set), [source.set]);
    const selectedAlt = alt ?? t(catalogImage?.alt) ?? "";

    useEffect(() => {
        if (!loadInViewport || !wrapperRef.current) return undefined;

        if (typeof IntersectionObserver === "undefined") {
            const timeout = setTimeout(() => setIsInViewport(true), 0);
            return () => clearTimeout(timeout);
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry?.isIntersecting) return;
            setIsInViewport(true);
            observer.disconnect();
        });

        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, [loadInViewport]);

    useEffect(() => {
        if (!wrapperRef.current) return undefined;

        const update = () => {
            const nextWidth = wrapperRef.current?.getBoundingClientRect?.().width || null;
            if (nextWidth) setMeasuredWidth(nextWidth);
        };

        update();

        if (typeof ResizeObserver === "undefined") {
            const win = getWindow();
            if (!win) return undefined;
            win.addEventListener("resize", update);
            return () => win.removeEventListener("resize", update);
        }

        const observer = new ResizeObserver(update);
        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    const selection = useMemo(() => {
        if (source.type === "src") {
            return {
                final: src ? { key: "src", src, hasDimensions: false } : null,
                preview: null,
                aspectRatio: null,
            };
        }

        if (normalizedItems.length === 0) {
            return {
                final: null,
                preview: null,
                aspectRatio: null,
            };
        }

        const variantItem = variant
            ? normalizedItems.find((item) => String(item.key) === String(variant))
            : null;

        if (variantItem) {
            return {
                final: variantItem,
                preview: null,
                aspectRatio: getAspectRatio(variantItem),
            };
        }

        const canUseResponsive = !!responsive && hasUsableDimensions(normalizedItems);
        if (!canUseResponsive) {
            if (source.type === "externalSet" && normalizedItems.length > 1) {
                warn(
                    "externalSet entries do not include naturalWidth/dimensionWidth metadata. Responsive and progressive behavior were disabled.",
                );
            }

            const fallback = normalizedItems[0];
            return {
                final: fallback,
                preview: null,
                aspectRatio: getAspectRatio(fallback),
            };
        }

        const displayWidth = resolveDisplayWidth({
            explicitWidth: width ?? w,
            measuredWidth,
            clientData,
        });
        const browserDpr = getWindow()?.devicePixelRatio || 1;
        const targetWidth = displayWidth
            ? displayWidth * (clientData?.dpr || clientData?.devicePixelRatio || browserDpr)
            : null;
        const final = getBestByTargetWidth(normalizedItems, targetWidth);
        const preview = progressive ? getSmallestPreview(normalizedItems) : null;

        return {
            final,
            preview: preview?.src !== final?.src ? preview : null,
            aspectRatio: getAspectRatio(final),
        };
    }, [
        source.type,
        src,
        normalizedItems,
        variant,
        responsive,
        progressive,
        width,
        w,
        measuredWidth,
        clientData,
    ]);

    const canLoad = !loadInViewport || isInViewport;
    const activeSrc = canLoad ? selection.final?.src : null;
    const previewSrc = canLoad ? selection.preview?.src : null;
    const isLoaded = !!activeSrc && readySrc === activeSrc;

    useEffect(() => {
        if (!activeSrc || !previewSrc || isLoaded) return undefined;

        const win = getWindow();
        if (!win?.Image) return undefined;

        const loader = new win.Image();
        loader.onload = () => setReadySrc(activeSrc);
        loader.onerror = () => setReadySrc(activeSrc);
        loader.src = activeSrc;

        return () => {
            loader.onload = null;
            loader.onerror = null;
        };
    }, [activeSrc, previewSrc, isLoaded]);

    const handleLoad = (event) => {
        if (displaySrc !== activeSrc) return;
        setReadySrc(activeSrc);
        onLoad?.(event);
    };

    const displaySrc = !isLoaded && previewSrc ? previewSrc : activeSrc;
    const shouldShowPlaceholder = !isLoaded && !!activeSrc;
    const objectFit = source.type === "src" ? "contain" : "cover";

    return {
        wrapperRef,
        imgSrc: displaySrc || "",
        selectedAlt,
        handleLoad,
        isLoaded,
        shouldShowImg: !!displaySrc,
        shouldShowPlaceholder,
        loadingAnimation,
        width: width ?? w ?? "100%",
        height: height ?? h ?? "auto",
        aspectRatio: selection.aspectRatio,
        objectFit,
    };
};

import { useCallback, useEffect, useMemo, useState } from "react";
import { Visibility } from "../Visibility";
import { getImageCatalog, IMAGE_CATALOG_GLOBAL_KEY } from "../createImageCatalog";
import { baseStore } from "../baseStore";

const DIRECT_SOURCE_PATTERN =
    /^(?:https?:|data:|blob:|file:|\/|\.{1,2}\/)|\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;

const hasAltValue = (alt) => {
    if (alt == null || alt === "") return false;
    if (typeof alt === "object") {
        return Object.values(alt).some((value) => typeof value === "string" && value.trim() !== "");
    }
    return true;
};

const resolveCatalogKey = (item, full) => {
    if (typeof item === "string" && !DIRECT_SOURCE_PATTERN.test(item)) return item;
    if (item && typeof item === "object" && item.catalogSet) return item.catalogSet;
    if (full?.catalogSet) return full.catalogSet;
    return null;
};

const resolveAlt = (item, full) => {
    if (item && typeof item === "object" && hasAltValue(item.alt)) return item.alt;

    const catalogKey = resolveCatalogKey(item, full);
    if (!catalogKey) return undefined;

    const catalogAlt = getImageCatalog()?.[catalogKey]?.alt;
    return hasAltValue(catalogAlt) ? catalogAlt : undefined;
};

const normalizeSource = (source) => {
    if (!source) return null;

    if (typeof source === "string") {
        return DIRECT_SOURCE_PATTERN.test(source) ? { src: source } : { catalogSet: source };
    }

    if (typeof source !== "object") return null;
    if (source.catalogSet) return { catalogSet: source.catalogSet };
    if (source.externalSet) return { externalSet: source.externalSet };
    if (source.imageSet) return { externalSet: source.imageSet };

    const src = source.src || source.url || source.path || source.file;
    if (src) return { src };

    return { externalSet: source };
};

export const normalizeGalleryImages = (images) => {
    if (!Array.isArray(images)) return [];

    return images
        .map((item, index) => {
            if (!item) return null;

            const isObject = typeof item === "object";
            const fullCandidate = isObject
                ? item.full || item.large || item.original || item.image || item
                : item;
            const thumbCandidate = isObject ? item.thumbnail || item.thumb || fullCandidate : item;
            const full = normalizeSource(fullCandidate);
            const thumbnail = normalizeSource(thumbCandidate) || full;

            if (!full) return null;

            return {
                key: isObject
                    ? item.id || item.key || item.catalogSet || `gallery-image-${index}`
                    : `${item}-${index}`,
                alt: resolveAlt(item, full),
                full,
                thumbnail,
            };
        })
        .filter(Boolean);
};

export const Base = ({ images, Variant, initialIndex = null, ...rest }) => {
    const catalog = baseStore.useGlobal((s) => s?.[IMAGE_CATALOG_GLOBAL_KEY]);
    const normalizedImages = useMemo(
        () => normalizeGalleryImages(images),
        [images, catalog],
    );
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const isOpen =
        Number.isInteger(selectedIndex) &&
        selectedIndex >= 0 &&
        selectedIndex < normalizedImages.length;

    const close = useCallback(() => setSelectedIndex(null), []);
    const previous = useCallback(() => setSelectedIndex((current) => Math.max(0, current - 1)), []);
    const next = useCallback(
        () => setSelectedIndex((current) => Math.min(normalizedImages.length - 1, current + 1)),
        [normalizedImages.length],
    );

    useEffect(() => {
        if (!isOpen || typeof document === "undefined") return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft" && selectedIndex > 0) previous();
            if (event.key === "ArrowRight" && selectedIndex < normalizedImages.length - 1) {
                next();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, next, normalizedImages.length, previous, selectedIndex]);

    useEffect(() => {
        if (selectedIndex == null) return;
        if (normalizedImages.length === 0) close();
        if (selectedIndex > normalizedImages.length - 1) {
            setSelectedIndex(normalizedImages.length - 1);
        }
    }, [close, normalizedImages.length, selectedIndex]);

    return (
        <Visibility.mount visible={normalizedImages.length > 0}>
            <Variant
                {...rest}
                images={normalizedImages}
                selectedIndex={selectedIndex}
                selectedImage={isOpen ? normalizedImages[selectedIndex] : null}
                isOpen={isOpen}
                canGoPrevious={isOpen && selectedIndex > 0}
                canGoNext={isOpen && selectedIndex < normalizedImages.length - 1}
                onSelect={setSelectedIndex}
                onClose={close}
                onPrevious={previous}
                onNext={next}
            />
        </Visibility.mount>
    );
};

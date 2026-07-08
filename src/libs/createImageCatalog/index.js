import { baseStore } from "../baseStore";

const CATALOG_KEY = "__imageCatalog";

const isPromiseLike = (value) => value && typeof value.then === "function";

const getModuleValue = (value) => {
    if (value && typeof value === "object" && "default" in value) return value.default;
    return value;
};

const getSetNameFromPath = (path) => {
    if (!path || typeof path !== "string") return null;
    const cleanPath = path.replace(/\\/g, "/").replace(/\/index\.(js|jsx|mjs|cjs)$/i, "");
    return cleanPath.split("/").filter(Boolean).pop() || null;
};

const normalizeSingleImage = (value, fallbackName) => {
    const image = getModuleValue(value);
    if (!image || typeof image !== "object") return null;

    return {
        name: image.name || fallbackName,
        ...image,
    };
};

const normalizeCatalogObject = (catalogObject = {}) => {
    return Object.entries(catalogObject).reduce((acc, [key, value]) => {
        const image = normalizeSingleImage(value, key);
        if (!image) return acc;
        const name = image.name || key;
        acc[name] = image;
        return acc;
    }, {});
};

const normalizeLoadedModules = (entries) => {
    const catalog = {};

    entries.forEach(([key, value]) => {
        const loadedValue = getModuleValue(value);

        if (loadedValue && typeof loadedValue === "object" && !loadedValue.imageSet) {
            const nestedCatalog = normalizeCatalogObject(loadedValue);
            if (Object.keys(nestedCatalog).length > 0) {
                Object.assign(catalog, nestedCatalog);
                return;
            }
        }

        const fallbackName = getSetNameFromPath(key) || key;
        const image = normalizeSingleImage(loadedValue, fallbackName);
        if (!image) return;
        catalog[image.name || fallbackName] = image;
    });

    return catalog;
};

const setCatalog = (catalog) => {
    baseStore.globalData.set((s) => {
        s[CATALOG_KEY] = catalog || {};
    });
    return catalog || {};
};

const getEntryList = (modules) => {
    if (!modules) return [];
    if (Array.isArray(modules)) return modules.map((value, index) => [String(index), value]);
    if (typeof modules === "object") return Object.entries(modules);
    return [];
};

export const createImageCatalog = (modules, _options = {}) => {
    const entries = getEntryList(modules);

    const loadedEntries = entries.map(([key, value]) => {
        if (typeof value !== "function") return [key, value];

        const loaded = value();
        if (isPromiseLike(loaded)) {
            return loaded.then((moduleValue) => [key, moduleValue]);
        }

        return [key, loaded];
    });

    if (loadedEntries.some(isPromiseLike)) {
        return Promise.all(loadedEntries).then((resolvedEntries) =>
            setCatalog(normalizeLoadedModules(resolvedEntries)),
        );
    }

    return setCatalog(normalizeLoadedModules(loadedEntries));
};

export const getImageCatalog = () => baseStore.globalData.get?.()?.[CATALOG_KEY] || {};

export const IMAGE_CATALOG_GLOBAL_KEY = CATALOG_KEY;

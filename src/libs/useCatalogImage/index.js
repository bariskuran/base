import { baseStore } from "../baseStore";
import { IMAGE_CATALOG_GLOBAL_KEY } from "../createImageCatalog";

export const useCatalogImage = (set) => {
    return baseStore.useGlobal((s) => {
        if (!set) return null;
        return s?.[IMAGE_CATALOG_GLOBAL_KEY]?.[set] || null;
    });
};

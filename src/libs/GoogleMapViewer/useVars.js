import { useMemo } from "react";
import { cssNormalizeSize } from "../cssNormalizeSize";

const EMBED_BASE = "https://www.google.com/maps/embed?pb=";

const normalizePb = (pb) => {
    if (pb == null || pb === "") return null;

    let value = String(pb).trim();
    if (!value) return null;

    if (/^https?:\/\//i.test(value)) {
        try {
            const url = new URL(value);
            const fromQuery = url.searchParams.get("pb");
            if (fromQuery) return fromQuery;
        } catch {
            /* keep raw */
        }
    }

    if (value.startsWith("pb=")) value = value.slice(3);

    return value || null;
};

export const useVars = ({ pb, w = 600, h = 450 } = {}) => {
    const src = useMemo(() => {
        const normalized = normalizePb(pb);
        if (!normalized) return null;
        return `${EMBED_BASE}${normalized}`;
    }, [pb]);

    const width = useMemo(() => cssNormalizeSize(w) ?? cssNormalizeSize(600), [w]);
    const height = useMemo(() => cssNormalizeSize(h) ?? cssNormalizeSize(450), [h]);

    return { src, width, height };
};

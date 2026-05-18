import { cssNormalizeSize } from "../../cssNormalizeSize";

const ORIGIN_KEYWORDS = new Set(["center", "top", "bottom", "left", "right", "start", "end"]);

const splitSpaceList = (value) => {
    if (value == null) return [];
    if (typeof value !== "string") return [value];
    return value.trim().split(/\s+/).filter(Boolean);
};

/** transform scale() argümanı: >3 veya % → yüzde; küçük sayılar birimsiz çarpan. */
export const normalizeFlexScaleValue = (value) => {
    if (value == null || value === "") return undefined;

    if (typeof value === "number") {
        if (!Number.isFinite(value)) return undefined;
        return Math.abs(value) > 3 ? `${value}%` : value;
    }

    const raw = String(value).trim();
    if (!raw) return undefined;
    if (raw.endsWith("%")) return raw;

    if (/^-?\d+(\.\d+)?$/.test(raw)) {
        const n = Number(raw);
        return Math.abs(n) > 3 ? `${n}%` : n;
    }

    return raw;
};

const formatScaleArg = (value) => {
    const normalized = normalizeFlexScaleValue(value);
    if (normalized == null) return undefined;
    return typeof normalized === "number" ? String(normalized) : normalized;
};

const buildUniformScale = (scale) => {
    if (scale == null || scale === "") return undefined;

    const parts = splitSpaceList(typeof scale === "string" ? scale : String(scale));

    if (parts.length > 1) {
        const args = parts.map(formatScaleArg).filter((item) => item != null);
        if (!args.length) return undefined;
        return `scale(${args.join(", ")})`;
    }

    const arg = formatScaleArg(scale);
    return arg != null ? `scale(${arg})` : undefined;
};

const buildFlexTransform = ({ scale, scaleX, scaleY } = {}) => {
    const parts = [];

    if (scaleX != null) {
        const sx = formatScaleArg(scaleX);
        if (sx != null) parts.push(`scaleX(${sx})`);
    }

    if (scaleY != null) {
        const sy = formatScaleArg(scaleY);
        if (sy != null) parts.push(`scaleY(${sy})`);
    }

    if (scale != null && scaleX == null && scaleY == null) {
        const uniform = buildUniformScale(scale);
        if (uniform) parts.push(uniform);
    }

    if (!parts.length) return undefined;
    return parts.join(" ");
};

/** transition süresi: 300 → 300ms, 0.3 → 0.3s; tam CSS shorthand olduğu gibi kalır. */
export const normalizeFlexDuration = (value) => {
    if (value == null || value === "") return undefined;

    if (typeof value === "number") {
        if (!Number.isFinite(value)) return undefined;
        return value >= 10 || (Number.isInteger(value) && value > 3) ? `${value}ms` : `${value}s`;
    }

    const raw = String(value).trim();
    if (!raw) return undefined;

    if (/^\d+(\.\d+)?(ms|s)$/i.test(raw)) return raw;

    if (/^-?\d+(\.\d+)?$/.test(raw)) {
        const n = Number(raw);
        return n >= 10 || (Number.isInteger(n) && n > 3) ? `${n}ms` : `${n}s`;
    }

    return raw;
};

const looksLikeTransitionShorthand = (value) =>
    typeof value === "string" && /\s/.test(value.trim()) && /[a-z]/i.test(value);

const normalizeTransitionPart = (value, property = "all") => {
    if (value == null || value === "") return undefined;

    if (looksLikeTransitionShorthand(value)) {
        return String(value).trim();
    }

    const duration = normalizeFlexDuration(value);
    if (duration == null) return undefined;

    return `${property} ${duration} ease`;
};

const normalizeOriginToken = (token) => {
    if (token == null || token === "") return undefined;

    if (typeof token === "number") {
        if (!Number.isFinite(token)) return undefined;
        if (token >= 0 && token <= 100) return `${token}%`;
        return cssNormalizeSize(token);
    }

    const raw = String(token).trim();
    if (!raw) return undefined;

    const lower = raw.toLowerCase();
    if (ORIGIN_KEYWORDS.has(lower)) return lower;
    if (raw.endsWith("%")) return raw;
    if (/^-?\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|dvw|dvh)$/i.test(raw)) return raw;

    if (/^-?\d+(\.\d+)?$/.test(raw)) {
        const n = Number(raw);
        if (n >= 0 && n <= 100) return `${n}%`;
        return cssNormalizeSize(raw);
    }

    return raw;
};

/** transform-origin: anahtar kelimeler, 50 → 50%, çoklu değer boşlukla. */
export const normalizeFlexTransformOrigin = (value) => {
    if (value == null || value === "") return undefined;

    if (Array.isArray(value)) {
        const parts = value.map(normalizeOriginToken).filter(Boolean);
        return parts.length ? parts.join(" ") : undefined;
    }

    if (typeof value === "number") {
        return normalizeOriginToken(value);
    }

    const raw = String(value).trim();
    if (!raw) return undefined;

    const parts = splitSpaceList(raw);
    if (!parts.length) return undefined;

    if (parts.length === 1) {
        return normalizeOriginToken(parts[0]);
    }

    const normalized = parts.map(normalizeOriginToken).filter(Boolean);
    return normalized.length ? normalized.join(" ") : undefined;
};

const buildFlexTransition = ({ transition, transitionX, transitionY } = {}) => {
    const parts = [];

    if (transition != null && transition !== "") {
        parts.push(
            looksLikeTransitionShorthand(transition)
                ? String(transition).trim()
                : normalizeTransitionPart(transition, "all"),
        );
    }

    const tx =
        transitionX != null && transitionX !== ""
            ? normalizeTransitionPart(transitionX, "transform")
            : undefined;
    const ty =
        transitionY != null && transitionY !== ""
            ? normalizeTransitionPart(transitionY, "transform")
            : undefined;

    if (tx && ty) {
        parts.push(tx === ty ? tx : tx);
    } else if (tx) {
        parts.push(tx);
    } else if (ty) {
        parts.push(ty);
    }

    const merged = parts.filter(Boolean);
    if (!merged.length) return undefined;
    return merged.join(", ");
};

export const generateFlexMotion = ({
    scale,
    scaleX,
    scaleY,
    transformOrigin,
    transition,
    transitionX,
    transitionY,
} = {}) => {
    const transform = buildFlexTransform({ scale, scaleX, scaleY });
    const transitionCss = buildFlexTransition({ transition, transitionX, transitionY });
    const originCss = normalizeFlexTransformOrigin(transformOrigin);

    return {
        ...(transform != null ? { transform } : {}),
        ...(originCss != null ? { transformOrigin: originCss } : {}),
        ...(transitionCss != null ? { transition: transitionCss } : {}),
    };
};

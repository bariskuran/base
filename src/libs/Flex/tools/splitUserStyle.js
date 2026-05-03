const CONTAINER_STYLE_KEYS = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "flex",
    "flexGrow",
    "flexShrink",
    "flexBasis",
    "alignSelf",
    "justifySelf",
    "placeSelf",
    "order",
    "boxSizing",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "zIndex",
    "overflow",
    "overflowX",
    "overflowY",
    "background",
    "backgroundColor",
    "color",
]);

/** generateProps üzerinden kabuğa taşınan yüzey anahtarları (iç flex’ten çıkarılır). */
export const SHELL_SURFACE_PROP_KEYS = ["bgColor", "color", "background", "backgroundColor"];

/**
 * Kullanıcının inline style objesini shell (container) ve iç flex (content) olarak böler.
 * padding/margin kabukta değil içerikte (ScrollBar ile çakışmaması için); bilinmeyen anahtarlar içerik tarafına düşer.
 */
export const splitUserStyle = (style) => {
    if (!style || typeof style !== "object") {
        return { containerStyle: undefined, contentStyle: undefined };
    }

    const container = {};
    const content = {};

    for (const [key, value] of Object.entries(style)) {
        if (value == null) continue;

        if (CONTAINER_STYLE_KEYS.has(key)) {
            container[key] = value;
        } else {
            content[key] = value;
        }
    }

    return {
        containerStyle: Object.keys(container).length ? container : undefined,
        contentStyle: Object.keys(content).length ? content : undefined,
    };
};

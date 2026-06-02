
export const SCROLL_EDGE_SHADOW_SIZE_REM = 18;

const LAYER_BASE = {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 2,
    transition: "opacity 0.25s ease",
};

const INNER_SHADOW_STOPS = "rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.08) 45%, rgba(0, 0, 0, 0) 100%";

const HORIZONTAL_LAYERS = {
    start: {
        ...LAYER_BASE,
        left: 0,
        top: 0,
        bottom: 0,
        width: SCROLL_EDGE_SHADOW_SIZE_REM,
        background: `linear-gradient(to right, ${INNER_SHADOW_STOPS})`,
        opacity: "var(--scroll-edge-start-opacity, 0)",
    },
    end: {
        ...LAYER_BASE,
        right: 0,
        top: 0,
        bottom: 0,
        width: SCROLL_EDGE_SHADOW_SIZE_REM,
        background: `linear-gradient(to left, ${INNER_SHADOW_STOPS})`,
        opacity: "var(--scroll-edge-end-opacity, 0)",
    },
};

const VERTICAL_LAYERS = {
    start: {
        ...LAYER_BASE,
        left: 0,
        right: 0,
        top: 0,
        height: SCROLL_EDGE_SHADOW_SIZE_REM,
        background: `linear-gradient(to bottom, ${INNER_SHADOW_STOPS})`,
        opacity: "var(--scroll-edge-start-opacity, 0)",
    },
    end: {
        ...LAYER_BASE,
        left: 0,
        right: 0,
        bottom: 0,
        height: SCROLL_EDGE_SHADOW_SIZE_REM,
        background: `linear-gradient(to top, ${INNER_SHADOW_STOPS})`,
        opacity: "var(--scroll-edge-end-opacity, 0)",
    },
};

const ScrollEdgeShadowLayers = ({ enabled, isRowLayout }) => {
    if (!enabled) return null;

    const layers = isRowLayout ? HORIZONTAL_LAYERS : VERTICAL_LAYERS;

    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 2,
            }}
        >
            <div style={layers.start} />
            <div style={layers.end} />
        </div>
    );
};

export default ScrollEdgeShadowLayers;

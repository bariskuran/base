import { useCallback, useEffect, useRef, useState } from "react";

const GESTURE_IDLE_MS = 220;
const SWIPE_THRESHOLD_PX = 60;

export const useTrackpadNavigation = ({ onRootChange, enabled, onNavigate }) => {
    const [root, setRoot] = useState(null);
    const attachRoot = useCallback(
        (node) => {
            setRoot(node);
            onRootChange?.(node);
        },
        [onRootChange],
    );
    const navigateRef = useRef(onNavigate);
    navigateRef.current = onNavigate;

    useEffect(() => {
        if (!enabled || !root) return undefined;

        let lastEventTime = -Infinity;
        let distance = 0;
        let axis = null;
        let consumed = false;

        const onWheel = (event) => {
            if (
                event.defaultPrevented ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey ||
                event.shiftKey
            )
                return;
            if (
                event.target instanceof Element &&
                event.target.closest(
                    "input, textarea, select, [contenteditable]:not([contenteditable='false'])",
                )
            )
                return;

            const now = performance.now();
            if (now - lastEventTime > GESTURE_IDLE_MS) {
                distance = 0;
                axis = null;
                consumed = false;
            }
            lastEventTime = now;

            const { deltaX, deltaY } = event;
            if (!deltaX && !deltaY) return;
            // Lock the gesture axis so diagonal page scrolling cannot turn into navigation.
            if (!axis) axis = Math.abs(deltaX) > Math.abs(deltaY) * 1.5 ? "x" : "y";
            if (axis !== "x") return;

            // A native non-passive listener also suppresses browser history swipes
            // over the slider. Pinch zoom and vertical page scrolling stay native.
            if (!event.cancelable) return;
            event.preventDefault();
            if (consumed) return;

            const unit =
                event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientWidth || 800 : 1;
            if (distance && Math.sign(deltaX) !== Math.sign(distance)) distance = 0;
            distance += deltaX * unit;
            if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return;

            consumed = true;
            navigateRef.current(Math.sign(distance));
        };

        root.addEventListener("wheel", onWheel, { passive: false });
        return () => root.removeEventListener("wheel", onWheel);
    }, [enabled, root]);

    return attachRoot;
};

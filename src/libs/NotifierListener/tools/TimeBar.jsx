import { memo, useRef, useEffect } from "react";

const TIMEBAR_KEYFRAMES_ID = "notifier-timebar-keyframes";

const ensureTimeBarKeyframes = () => {
    if (typeof document === "undefined") return;
    if (document.getElementById(TIMEBAR_KEYFRAMES_ID)) return;

    const style = document.createElement("style");
    style.id = TIMEBAR_KEYFRAMES_ID;
    style.textContent = `
        @keyframes notifierTimeBarGrow {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
    `;
    document.head.appendChild(style);
};

export const TimeBar = memo(
    function TimeBar({ killAfterMs, shownAt }) {
        const fillRef = useRef(null);

        useEffect(() => {
            ensureTimeBarKeyframes();
            const el = fillRef.current;
            if (!el || !killAfterMs) return;

            const elapsed = Math.max(0, Date.now() - (shownAt || Date.now()));
            const delaySec = Math.min(elapsed / 1000, killAfterMs / 1000);

            el.style.transformOrigin = "left center";
            el.style.transform = "scaleX(0)";
            el.style.animation = "none";
            void el.offsetWidth;
            el.style.animation = `notifierTimeBarGrow ${killAfterMs}ms linear forwards`;
            if (delaySec > 0) {
                el.style.animationDelay = `-${delaySec}s`;
            }
        }, [killAfterMs, shownAt]);

        return (
            <div data-slot="timeBar">
                <div ref={fillRef} data-slot="timeBarFill" />
            </div>
        );
    },
    (prev, next) => prev.killAfterMs === next.killAfterMs && prev.shownAt === next.shownAt,
);

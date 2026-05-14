import { ensureFloatingMountHost, pickFloatingMountRoot } from "./floatingMountHost";

const normalizeAlignX = (alignX) => {
    if (alignX === "start") return "left";
    if (alignX === "end") return "right";
    if (alignX === "left" || alignX === "right" || alignX === "center") return alignX;
    return undefined;
};

const normalizeAlignY = (alignY) => {
    if (alignY === "top" || alignY === "bottom") return alignY;
    return undefined;
};

const oppositeY = (alignY) => (alignY === "bottom" ? "top" : "bottom");

const unique = (arr) => [...new Set(arr.filter(Boolean))];

const clamp = (value, min, max) => {
    if (max < min) return min;
    return Math.min(Math.max(value, min), max);
};

const overflowAmount = (rect, box) => {
    let o = 0;
    o += Math.max(0, box.left - rect.left);
    o += Math.max(0, rect.right - box.right);
    o += Math.max(0, box.top - rect.top);
    o += Math.max(0, rect.bottom - box.bottom);
    return o;
};

const getMountBoundsRect = (mountRoot) => {
    if (typeof window === "undefined") {
        return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }
    if (!mountRoot || mountRoot === document.body) {
        const vv = window.visualViewport;
        if (vv) {
            const left = vv.offsetLeft;
            const top = vv.offsetTop;
            return {
                left,
                top,
                right: left + vv.width,
                bottom: top + vv.height,
                width: vv.width,
                height: vv.height,
            };
        }
        const w = window.innerWidth;
        const h = window.innerHeight;
        return { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
    }
    const r = mountRoot.getBoundingClientRect();
    return {
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
    };
};

const getFloatingRectForMeasure = (floatingEl, maxWidthPx, viewportOffset = 20) => {
    if (!floatingEl) return null;

    const prev = {
        inset: floatingEl.style.inset,
        visibility: floatingEl.style.visibility,
        pointerEvents: floatingEl.style.pointerEvents,
        maxWidth: floatingEl.style.maxWidth,
        width: floatingEl.style.width,
        transform: floatingEl.style.transform,
    };

    floatingEl.style.inset = "0px auto auto 0px";
    floatingEl.style.visibility = "hidden";
    floatingEl.style.pointerEvents = "none";
    floatingEl.style.transform = "none";
    floatingEl.style.width = "max-content";
    floatingEl.style.maxWidth =
        maxWidthPx > 0
            ? `${maxWidthPx}px`
            : `calc(100vw - ${viewportOffset * 2}px)`;

    const rect = floatingEl.getBoundingClientRect();

    floatingEl.style.inset = prev.inset;
    floatingEl.style.visibility = prev.visibility;
    floatingEl.style.pointerEvents = prev.pointerEvents;
    floatingEl.style.maxWidth = prev.maxWidth;
    floatingEl.style.width = prev.width;
    floatingEl.style.transform = prev.transform;

    return rect;
};

const getPosition = ({
    gap = 20,
    viewportOffset = 20,
    childrenRef,
    floatingRef,
    setLocal,
    alignXFromUser,
    alignYFromUser,
    currentAlignX = "center",
    currentAlignY = "top",
    resolveFloatingMount,
    floatingLayerEl,
} = {}) => {
    const childrenEl = childrenRef?.current;
    const floatingEl = floatingRef?.current;

    if (!childrenEl || !floatingEl) {
        return {
            positionX: 0,
            positionY: 0,
            alignX: "center",
            alignY: "top",
        };
    }

    const childrenRect = childrenEl.getBoundingClientRect();

    const mountRoot = pickFloatingMountRoot(childrenEl, resolveFloatingMount);
    const layer =
        floatingLayerEl instanceof HTMLElement ? floatingLayerEl : ensureFloatingMountHost(mountRoot);
    const layerRect = layer?.getBoundingClientRect?.() ?? { left: 0, top: 0 };

    const bounds = getMountBoundsRect(mountRoot);
    const innerLeft = bounds.left + viewportOffset;
    const innerTop = bounds.top + viewportOffset;
    const innerRight = bounds.right - viewportOffset;
    const innerBottom = bounds.bottom - viewportOffset;
    const innerWidth = Math.max(0, innerRight - innerLeft);
    const innerHeight = Math.max(0, innerBottom - innerTop);
    const maxMeasureWidth = innerWidth;

    const floatingRect = getFloatingRectForMeasure(floatingEl, maxMeasureWidth, viewportOffset);
    if (!floatingRect) return;

    const liveRect = floatingEl.getBoundingClientRect();
    const fw = Math.max(floatingRect.width, liveRect.width > 0.5 ? liveRect.width : 0);
    const fh = Math.max(floatingRect.height, liveRect.height > 0.5 ? liveRect.height : 0);
    const arrowSlop = Math.max(72, gap * 2, Math.round(viewportOffset * 2));
    const fhCol = fh + arrowSlop;

    const flipMargin = Math.max(8, Math.round(viewportOffset * 0.5));
    const safeTop = Math.min(innerTop + flipMargin, innerBottom);
    const safeBottom = Math.max(innerBottom - flipMargin, safeTop);
    const safeLeft = Math.min(innerLeft + flipMargin, innerRight);
    const safeRight = Math.max(innerRight - flipMargin, safeLeft);
    const safeBox = { top: safeTop, left: safeLeft, right: safeRight, bottom: safeBottom };

    const topYViewport = childrenRect.top - fh - gap;
    const bottomYViewport = childrenRect.bottom + gap;
    const yByAlign = {
        top: topYViewport,
        bottom: bottomYViewport,
    };

    const centerXViewport = childrenRect.left + childrenRect.width / 2 - fw / 2;
    const leftAlignedXViewport = childrenRect.left;
    const rightAlignedXViewport = childrenRect.right - fw;
    const xByAlign = {
        center: centerXViewport,
        left: leftAlignedXViewport,
        right: rightAlignedXViewport,
    };

    const xSpan = Math.max(0, innerRight - innerLeft - fw);
    const xProbe = clamp(centerXViewport, innerLeft, innerLeft + xSpan);

    const preferredY = normalizeAlignY(alignYFromUser) || "top";
    const lockedY = normalizeAlignY(currentAlignY) || preferredY;
    const yCandidates = unique([lockedY, oppositeY(lockedY)]);

    const scoreY = (align) => {
        const y = yByAlign[align];
        const rect = { left: xProbe, top: y, right: xProbe + fw, bottom: y + fhCol };
        return overflowAmount(rect, safeBox);
    };

    const rankY = (cand) => {
        if (cand === preferredY) return 0;
        if (cand === lockedY) return 1;
        return 2;
    };

    let bestYScore = Infinity;
    let alignY = lockedY;
    for (const cand of yCandidates) {
        if (cand !== "top" && cand !== "bottom") continue;
        const sc = scoreY(cand);
        if (sc < bestYScore - 0.5) {
            bestYScore = sc;
            alignY = cand;
        } else if (Math.abs(sc - bestYScore) <= 0.5 && rankY(cand) < rankY(alignY)) {
            alignY = cand;
        }
    }

    let positionY = clamp(yByAlign[alignY], innerTop, innerBottom - fh);

    const preferredX = normalizeAlignX(alignXFromUser) || "center";
    const lockedX = normalizeAlignX(currentAlignX) || preferredX;
    const xCandidates = unique([lockedX, preferredX, "center", "left", "right"]);

    const scoreX = (align) => {
        const x = xByAlign[align];
        const rect = { left: x, top: positionY, right: x + fw, bottom: positionY + fhCol };
        return overflowAmount(rect, safeBox);
    };

    const rankX = (cand) => {
        if (cand === preferredX) return 0;
        if (cand === lockedX) return 1;
        return 2;
    };

    let bestXScore = Infinity;
    let alignX = lockedX;
    for (const cand of xCandidates) {
        if (typeof xByAlign[cand] !== "number") continue;
        const sc = scoreX(cand);
        if (sc < bestXScore - 0.5) {
            bestXScore = sc;
            alignX = cand;
        } else if (Math.abs(sc - bestXScore) <= 0.5 && rankX(cand) < rankX(alignX)) {
            alignX = cand;
        }
    }

    let positionX = clamp(xByAlign[alignX], innerLeft, innerRight - fw);

    const innerBox = { top: innerTop, left: innerLeft, right: innerRight, bottom: innerBottom };
    const predCur = {
        left: positionX,
        top: positionY,
        right: positionX + fw,
        bottom: positionY + fhCol,
    };
    let oCur = overflowAmount(predCur, innerBox);
    if (oCur > 0.5) {
        const altY2 = oppositeY(alignY);
        if (altY2 === "top" || altY2 === "bottom") {
            const altTop2 = clamp(yByAlign[altY2], innerTop, innerBottom - fh);
            const predAlt2 = {
                left: positionX,
                top: altTop2,
                right: positionX + fw,
                bottom: altTop2 + fhCol,
            };
            const oAlt2 = overflowAmount(predAlt2, innerBox);
            if (oAlt2 + 1 < oCur) {
                alignY = altY2;
                positionY = altTop2;
            }
        }
    }

    setLocal((s) => {
        s.positionX = Math.round(positionX - layerRect.left);
        s.positionY = Math.round(positionY - layerRect.top);
        s.alignX = alignX;
        s.alignY = alignY;
        s.blockVisibility = false;
    });
};
export default getPosition;

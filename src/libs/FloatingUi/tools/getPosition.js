const getFloatingRectForMeasure = (floatingEl, viewportOffset = 20) => {
    if (!floatingEl) return null;

    const prev = {
        top: floatingEl.style.top,
        left: floatingEl.style.left,
        right: floatingEl.style.right,
        bottom: floatingEl.style.bottom,
        visibility: floatingEl.style.visibility,
        pointerEvents: floatingEl.style.pointerEvents,
        maxWidth: floatingEl.style.maxWidth,
        width: floatingEl.style.width,
        transform: floatingEl.style.transform,
    };

    floatingEl.style.top = "0px";
    floatingEl.style.left = "0px";
    floatingEl.style.right = "auto";
    floatingEl.style.bottom = "auto";
    floatingEl.style.visibility = "hidden";
    floatingEl.style.pointerEvents = "none";
    floatingEl.style.transform = "none";
    floatingEl.style.width = "max-content";
    floatingEl.style.maxWidth = `calc(100vw - ${viewportOffset * 2}px)`;

    const rect = floatingEl.getBoundingClientRect();

    floatingEl.style.top = prev.top;
    floatingEl.style.left = prev.left;
    floatingEl.style.right = prev.right;
    floatingEl.style.bottom = prev.bottom;
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
    stickiness = 8,
    childrenRef,
    floatingRef,
    setLocal,
    alignXFromUser,
    alignYFromUser,
    currentAlignX = "center",
    currentAlignY = "top",
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
    const floatingRect = getFloatingRectForMeasure(floatingEl, viewportOffset);
    if (!floatingRect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let alignX = "center";
    let alignY = "top";

    /**
     * -----------------------
     * Y ekseni
     * viewport bazlı fit kontrolü
     * document bazlı final pozisyon
     * -----------------------
     */
    const topYViewport = childrenRect.top - floatingRect.height - gap;
    const bottomYViewport = childrenRect.bottom + gap;

    const canFitTop = topYViewport >= viewportOffset;
    const canFitBottom = bottomYViewport + floatingRect.height <= viewportHeight - viewportOffset;
    const canFitTopSticky = topYViewport >= viewportOffset - stickiness;
    const canFitBottomSticky =
        bottomYViewport + floatingRect.height <= viewportHeight - viewportOffset + stickiness;

    let positionY;

    if (alignYFromUser === "top" && canFitTop) {
        alignY = "top";
        positionY = topYViewport;
    } else if (alignYFromUser === "bottom" && canFitBottom) {
        alignY = "bottom";
        positionY = bottomYViewport;
    } else if (!alignYFromUser && currentAlignY === "top" && canFitTopSticky) {
        alignY = "top";
        positionY = topYViewport;
    } else if (!alignYFromUser && currentAlignY === "bottom" && canFitBottomSticky) {
        alignY = "bottom";
        positionY = bottomYViewport;
    } else {
        if (canFitTop) {
            alignY = "top";
            positionY = topYViewport;
        } else if (canFitBottom) {
            alignY = "bottom";
            positionY = bottomYViewport;
        } else {
            const topSpace = childrenRect.top - gap;
            const bottomSpace = viewportHeight - childrenRect.bottom - gap;

            if (bottomSpace >= topSpace) {
                alignY = "bottom";
                positionY = bottomYViewport;
            } else {
                alignY = "top";
                positionY = topYViewport;
            }
        }
    }

    /**
     * -----------------------
     * X ekseni
     * viewport bazlı fit kontrolü
     * document bazlı final pozisyon
     * -----------------------
     */
    const centerXViewport = childrenRect.left + childrenRect.width / 2 - floatingRect.width / 2;
    const leftAlignedXViewport = childrenRect.left;
    const rightAlignedXViewport = childrenRect.right - floatingRect.width;

    const canFitCenterX =
        centerXViewport >= viewportOffset &&
        centerXViewport + floatingRect.width <= viewportWidth - viewportOffset;

    const canFitLeftX =
        leftAlignedXViewport >= viewportOffset &&
        leftAlignedXViewport + floatingRect.width <= viewportWidth - viewportOffset;

    const canFitRightX =
        rightAlignedXViewport >= viewportOffset &&
        rightAlignedXViewport + floatingRect.width <= viewportWidth - viewportOffset;
    const canFitCenterXSticky =
        centerXViewport >= viewportOffset - stickiness &&
        centerXViewport + floatingRect.width <= viewportWidth - viewportOffset + stickiness;
    const canFitLeftXSticky =
        leftAlignedXViewport >= viewportOffset - stickiness &&
        leftAlignedXViewport + floatingRect.width <= viewportWidth - viewportOffset + stickiness;
    const canFitRightXSticky =
        rightAlignedXViewport >= viewportOffset - stickiness &&
        rightAlignedXViewport + floatingRect.width <= viewportWidth - viewportOffset + stickiness;

    let positionX = centerXViewport;

    if (alignXFromUser === "center" && canFitCenterX) {
        alignX = "center";
        positionX = centerXViewport;
    } else if (alignXFromUser === "left" && canFitLeftX) {
        alignX = "left";
        positionX = leftAlignedXViewport;
    } else if (alignXFromUser === "right" && canFitRightX) {
        alignX = "right";
        positionX = rightAlignedXViewport;
    } else if (!alignXFromUser && currentAlignX === "center" && canFitCenterXSticky) {
        alignX = "center";
        positionX = centerXViewport;
    } else if (!alignXFromUser && currentAlignX === "left" && canFitLeftXSticky) {
        alignX = "left";
        positionX = leftAlignedXViewport;
    } else if (!alignXFromUser && currentAlignX === "right" && canFitRightXSticky) {
        alignX = "right";
        positionX = rightAlignedXViewport;
    } else {
        const centerLeftOverflow = centerXViewport < viewportOffset;
        const centerRightOverflow =
            centerXViewport + floatingRect.width > viewportWidth - viewportOffset;

        if (!centerLeftOverflow && !centerRightOverflow) {
            alignX = "center";
            positionX = centerXViewport;
        } else if (canFitLeftX) {
            alignX = "left";
            positionX = leftAlignedXViewport;
        } else if (canFitRightX) {
            alignX = "right";
            positionX = rightAlignedXViewport;
        } else {
            alignX = centerLeftOverflow ? "left" : "right";
            positionX = Math.min(
                Math.max(centerXViewport, viewportOffset),
                viewportWidth - floatingRect.width - viewportOffset,
            );
        }
    }

    positionX = Math.min(
        Math.max(positionX, viewportOffset),
        viewportWidth - floatingRect.width - viewportOffset,
    );
    positionY = Math.min(
        Math.max(positionY, viewportOffset),
        viewportHeight - floatingRect.height - viewportOffset,
    );

    setLocal((s) => {
        s.positionX = Math.round(positionX);
        s.positionY = Math.round(positionY);
        s.alignX = alignX;
        s.alignY = alignY;
    });
};
export default getPosition;

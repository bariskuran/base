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
    childrenRef,
    floatingRef,
    setLocal,
    alignXFromUser,
    alignYFromUser,
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

    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

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

    const topY = topYViewport + scrollY;
    const bottomY = bottomYViewport + scrollY;

    const canFitTop = topYViewport >= viewportOffset;
    const canFitBottom = bottomYViewport + floatingRect.height <= viewportHeight - viewportOffset;

    let positionY;

    if (alignYFromUser === "top" && canFitTop) {
        alignY = "top";
        positionY = topY;
    } else if (alignYFromUser === "bottom" && canFitBottom) {
        alignY = "bottom";
        positionY = bottomY;
    } else {
        if (canFitTop) {
            alignY = "top";
            positionY = topY;
        } else if (canFitBottom) {
            alignY = "bottom";
            positionY = bottomY;
        } else {
            const topSpace = childrenRect.top - gap;
            const bottomSpace = viewportHeight - childrenRect.bottom - gap;

            if (bottomSpace >= topSpace) {
                alignY = "bottom";
                positionY = bottomY;
            } else {
                alignY = "top";
                positionY = topY;
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

    const centerX = centerXViewport + scrollX;
    const leftAlignedX = leftAlignedXViewport + scrollX;
    const rightAlignedX = rightAlignedXViewport + scrollX;

    const canFitCenterX =
        centerXViewport >= viewportOffset &&
        centerXViewport + floatingRect.width <= viewportWidth - viewportOffset;

    const canFitLeftX =
        leftAlignedXViewport >= viewportOffset &&
        leftAlignedXViewport + floatingRect.width <= viewportWidth - viewportOffset;

    const canFitRightX =
        rightAlignedXViewport >= viewportOffset &&
        rightAlignedXViewport + floatingRect.width <= viewportWidth - viewportOffset;

    let positionX = centerX;

    if (alignXFromUser === "center" && canFitCenterX) {
        alignX = "center";
        positionX = centerX;
    } else if (alignXFromUser === "left" && canFitLeftX) {
        alignX = "left";
        positionX = leftAlignedX;
    } else if (alignXFromUser === "right" && canFitRightX) {
        alignX = "right";
        positionX = rightAlignedX;
    } else {
        const centerLeftOverflow = centerXViewport < viewportOffset;
        const centerRightOverflow =
            centerXViewport + floatingRect.width > viewportWidth - viewportOffset;

        if (!centerLeftOverflow && !centerRightOverflow) {
            alignX = "center";
            positionX = centerX;
        } else if (canFitLeftX) {
            alignX = "left";
            positionX = leftAlignedX;
        } else if (canFitRightX) {
            alignX = "right";
            positionX = rightAlignedX;
        } else {
            alignX = centerLeftOverflow ? "left" : "right";
            positionX = Math.min(
                Math.max(centerX, scrollX + viewportOffset),
                scrollX + viewportWidth - floatingRect.width - viewportOffset,
            );
        }
    }

    positionX = Math.min(
        Math.max(positionX, scrollX + viewportOffset),
        scrollX + viewportWidth - floatingRect.width - viewportOffset,
    );

    setLocal((s) => {
        s.positionX = Math.round(positionX);
        s.positionY = Math.round(positionY);
        s.alignX = alignX;
        s.alignY = alignY;
    });
};
export default getPosition;

import { baseStore } from "../baseStore";

let prevOverflowY;
let prevOverflow;

export const scrollLock = (boo) => {
    baseStore?.globalData?.set?.({ isScrollLocked: !!boo });

    if (typeof document === "undefined") return;

    const body = document.body;
    if (!body) return;

    if (boo) {
        if (prevOverflowY === undefined && prevOverflow === undefined) {
            prevOverflowY = body.style.overflowY;
            prevOverflow = body.style.overflow;
        }

        body.style.overflowY = "hidden";
        body.style.overflow = "hidden";
        return;
    }

    if (prevOverflowY !== undefined) body.style.overflowY = prevOverflowY;
    else body.style.overflowY = "";

    if (prevOverflow !== undefined) body.style.overflow = prevOverflow;
    else body.style.overflow = "";

    prevOverflowY = undefined;
    prevOverflow = undefined;
};

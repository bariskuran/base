import { baseStore } from "../@baseStore";

let prevOverflowY;
let prevOverflow;

/**
 * Locks/unlocks document scrolling by toggling `document.body` overflow styles,
 * and also syncs `baseStore.globalData.isScrollLocked`.
 *
 * - When `boo === true`, it stores the previous inline `overflow` / `overflowY`
 *   values once, then applies `hidden`.
 * - When `boo === false`, it restores the previously stored inline values.
 * - Safe in SSR/Node environments: if `document` is not available, it won't throw.
 *   (It still attempts to set `baseStore.globalData.isScrollLocked`.)
 *
 * @param {boolean} boo
 * Whether scrolling should be locked.
 *
 * @returns {void}
 *
 * @example
 * scrollLock(true);
 * // ... modal open
 * scrollLock(false);
 *
 * @example
 * useEffect(() => {
 *   scrollLock(true);
 *   return () => scrollLock(false);
 * }, []);
 */
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

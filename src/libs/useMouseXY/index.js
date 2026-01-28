import { useEventListener } from "../useEventListener";
import { baseStore } from "../@baseStore";

/*

const [x, y] = useMouseXY(50);

*/

/**
 * React hook that tracks the mouse position (x, y) using a throttled
 * `mousemove` event listener.
 *
 * Internally uses a shared local store and an event listener with
 * optional throttling to reduce update frequency.
 *
 * @param {number} [delay=100]
 * Throttle delay in milliseconds for mousemove updates
 *
 * @returns {[number, number]}
 * Returns the current mouse coordinates as `[x, y]`
 */
export const useMouseXY = (delay = 100) => {
    const { x, y, setLocal } = baseStore.useLocal();

    useEventListener(
        "mousemove",
        ({ clientX, clientY }) => {
            setLocal?.({ x: clientX, y: clientY });
        },
        { delay, isThrottle: true, passive: true },
    );

    return [x, y];
};

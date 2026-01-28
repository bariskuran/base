import { useEffect, useRef } from "react";

/*

useScrollThrottle(()=>{console.log("scrolling...")}, 100);

*/

/**
 * React hook that throttles a callback function based on scroll events.
 * The callback will be executed at most once per given delay interval,
 * regardless of how frequently the scroll event fires.
 *
 * @param {() => void} callback
 * Function to be executed on throttled scroll events
 *
 * @param {number} [delay=100]
 * Minimum time (in milliseconds) between consecutive callback executions
 *
 * @returns {void}
 */
export const useScrollThrottle = (callback, delay = 100) => {
    const lastCall = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastCall.current >= delay) {
                callback();
                lastCall.current = now;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [callback, delay]);

    return null;
};

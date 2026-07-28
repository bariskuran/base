import { useVars } from "./useVars";

/**
 * Animated / infinite number counter.
 *
 * @example Scalar
 * const [currentNumber, ref, { start, pause, stop }] = useCountNumber({
 *   endNumber: 1200,
 *   duration: 3,
 * });
 *
 * @example Multi (shared ref + synced animation)
 * const [[a, b, c], ref] = useCountNumber({
 *   endNumber: [10, 20, 30],
 *   startNumber: 0, // or [0, 5, 10]
 *   duration: 3,
 * });
 */
export const useCountNumber = (options = {}) => {
    const vars = useVars(options);

    return [
        vars.currentNumber,
        vars.ref,
        {
            start: vars.start,
            pause: vars.pause,
            stop: vars.stop,
            isRunning: vars.isRunning,
            isPaused: vars.isPaused,
            isCompleted: vars.isCompleted,
            status: vars.status,
            inViewport: vars.inViewport,
            rawValue: vars.rawValue,
            isMulti: vars.isMulti,
        },
    ];
};

export {
    formatCountNumber,
    resolveCountLocale,
    resolveEndList,
    resolveStartList,
    snapToStep,
} from "./format";
export { useVars as useCountNumberVars } from "./useVars";

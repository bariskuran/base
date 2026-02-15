import { useRef } from "react";
import { useBaseEffect } from "../useBaseEffect";
/*

useEffectAfterMount(() => {
    console.log("This will run only after the component has mounted");
}, []);

*/

/**
 * Runs an effect only after the component has mounted.
 * Skips the first render, then executes `callback` on subsequent dependency changes.
 *
 * @param {() => void} callback
 * Effect callback to run after mount
 * @param {any[]} [dependencies=[]]
 * Dependency array (same semantics as `useEffect`)
 *
 * @returns {null}
 */
export const useEffectAfterMount = (callback, dependencies = []) => {
    const isFirst = useRef(true);
    const callbackRef = useRef(callback);

    useBaseEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useBaseEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        callbackRef.current?.();
    }, dependencies);

    return null;
};

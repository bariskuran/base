import { useEffect, useRef } from "react";

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
export const useEffectAfterMount = (effect, deps = []) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        return effect();
    }, deps);
};

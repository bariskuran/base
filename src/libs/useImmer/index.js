import { useState, useCallback } from "react";
import { produce, freeze } from "immer";

/**
 * A small helper hook that combines React's `useState` with Immer-style updates.
 *
 * This hook is conceptually derived from the common "useState + immer" pattern
 * frequently shown in the React and Immer documentation/examples.
 * It is NOT a reimplementation of Immer's own hooks, but a lightweight wrapper
 * around `useState`, `produce`, and `freeze`.
 *
 * Features:
 * - Supports functional (draft-based) updates via Immer's `produce`
 * - Supports direct value replacement
 * - Deep-freezes the stored state to prevent accidental mutations
 *
 * Notes:
 * - This hook is intended for **component-local state**.
 * - The state lifecycle is fully controlled by React (mount/unmount).
 * - For shared or externally accessible state, prefer a store-based solution
 *   (e.g. `baseStore`).
 * - Original code source: **https://github.com/immerjs/use-immer**
 *
 * @template T
 * @param {T | (() => T)} init - Initial state value or lazy initializer function.
 * @returns {[T, (updater: ((draft: T) => void) | T) => void]}
 *
 * @example
 * const [state, setState] = useImmer({ count: 0 });
 *
 * setState(draft => {
 *   draft.count += 1;
 * });
 *
 * @example
 * setState({ count: 10 }); // replace state directly
 */
export const useImmer = (init) => {
    const [val, updateValue] = useState(() =>
        freeze(typeof init === "function" ? init() : init, true),
    );

    /**
     * Update state using either:
     * - an Immer recipe function (draft mutation), or
     * - a direct value replacement.
     */
    const setValue = useCallback((updater) => {
        if (typeof updater === "function") {
            updateValue(produce(updater));
        } else {
            updateValue(freeze(updater, true));
        }
    }, []);

    return [val, setValue];
};

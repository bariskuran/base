import { useCallback, useEffect } from "react";
import { baseStore } from "../@baseStore";

/*

const [prevCount, manuallySetPreviousValue] = usePrevious(count);

useEffect(() => {
  if (prevCount !== count) {
    console.log("count changed from", prevCount, "to", count);
  }
}, [count]);

*/

/**
 * Stores and returns the previous value from the last render.
 *
 * @template T
 * @param {T} value
 * @returns {T | undefined}
 */
export const usePrevious = (value) => {
    const { previousValue, setLocal } = baseStore.useLocal({ previousValue: null });

    const setPreviousValue = useCallback(
        (value) => {
            setLocal?.({ previousValue: value });
        },
        [setLocal],
    );

    useEffect(() => {
        setPreviousValue(value);
    }, [value]);

    return [previousValue, setPreviousValue];
};

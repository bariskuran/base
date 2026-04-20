import { sortBy } from "../sortBy";

/**
 * Pushes an element into an array, sorts it ascending, and returns:
 * - the sorted array (may include duplicates)
 * - the first index of `el` in the sorted array
 * - the nearest lower unique neighbor of `el`
 * - the nearest upper unique neighbor of `el`
 *
 * Uniqueness is determined via `Set` (works as expected for primitives).
 *
 * @param {any[]} [arr=[]] Input array
 * @param {any} [el=0] Element to push
 * @returns {[any[], number, any | undefined, any | undefined]}
 * Returns `[sortedArray, index, lowerValue, upperValue]`.
 *
 * @example
 * // basic
 * pushAsSorted([5, 1, 3], 4);
 * // => [[1, 3, 4, 5], 2, 3, 5]
 *
 * @example
 * // when el already exists (duplicates allowed in returned array)
 * pushAsSorted([1, 2, 2, 4], 2);
 * // sortedArray => [1, 2, 2, 2, 4]
 * // index => 1 (first occurrence)
 * // lowerValue => 1
 * // upperValue => 4
 *
 * @example
 * // edges
 * pushAsSorted([10, 20], 5);
 * // => [[5, 10, 20], 0, undefined, 10]
 *
 * pushAsSorted([10, 20], 30);
 * // => [[10, 20, 30], 2, 20, undefined]
 */
export const pushAsSorted = (arr = [], el = 0) => {
    const arrayCopy = [...arr, el].sort(sortBy.asc);

    const uniqueArray = [...new Set(arrayCopy)];

    const index = arrayCopy.indexOf(el);
    const uniqueIndex = uniqueArray.indexOf(el);

    let lowerValue;
    let upperValue;

    if (uniqueIndex > 0) lowerValue = uniqueArray[uniqueIndex - 1];
    if (uniqueIndex >= 0 && uniqueIndex < uniqueArray.length - 1)
        upperValue = uniqueArray[uniqueIndex + 1];

    return [arrayCopy, index, lowerValue, upperValue];
};

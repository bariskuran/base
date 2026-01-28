import { sortFunctionAsc } from "../sortFunctionAsc";

export const pushAsSorted = (arr = [], el = 0) => {
    const arrayCopy = [...arr];
    arrayCopy.push(el);
    arrayCopy.sort(sortFunctionAsc);
    const uniqueArray = [...new Set(arrayCopy)];
    const index = arrayCopy.indexOf(el);
    const uniqueIndex = uniqueArray.indexOf(el);

    let lowerValue = undefined;
    let upperValue = undefined;
    if (index > 0) lowerValue = uniqueArray[uniqueIndex - 1];
    if (index < uniqueArray.length - 1) upperValue = uniqueArray[uniqueIndex + 1];

    return [arrayCopy, index, lowerValue, upperValue];
};

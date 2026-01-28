/* iki derin objeyi birleştirir. */

import { typeOf } from "../typeOf";

export const deepMerge = (oldData, newData) => {
    if (oldData === null && typeOf(newData) === "object") return { ...newData };

    const output = { ...oldData };
    if (typeOf(oldData) !== "object" || typeOf(newData) !== "object") return output;

    Object.keys(newData).forEach((key) => {
        if (typeOf(newData[key]) === "object") {
            if (!(key in oldData) || oldData[key] === null) output[key] = newData[key];
            else output[key] = deepMerge(oldData[key], newData[key]);
        } else output[key] = newData[key];
    });
    return output;
};

import { typeOf } from "../typeOf";

const isMergeableObject = (value) => value !== null && typeOf(value) === "object";
const isUnsafeKey = (key) => key === "__proto__" || key === "constructor" || key === "prototype";

export const deepMerge = (oldData, newData) => {
    if (!isMergeableObject(newData)) {
        return newData;
    }
    if (!isMergeableObject(oldData)) {
        return { ...newData };
    }

    const output = { ...oldData };

    for (const key of Object.keys(newData)) {
        if (isUnsafeKey(key)) continue;

        const nextVal = newData[key];
        const prevVal = oldData[key];

        if (isMergeableObject(nextVal) && isMergeableObject(prevVal)) {
            output[key] = deepMerge(prevVal, nextVal);
        } else {
            output[key] = nextVal;
        }
    }

    return output;
};

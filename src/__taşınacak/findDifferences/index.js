import { typeOf } from "../typeOf";

export const findDifferences = (oldData, newData, IMMUTABLE_KEY_NAME = "value", basePath) => {
    const [type1, type2] = typeOf(oldData, newData);
    let changedValues = {};

    if (
        type1 !== type2 ||
        type1 === "function" ||
        type1 === "undefined" ||
        type2 === "undefined" ||
        type1 === "null" ||
        type2 === "null"
    ) {
        changedValues[basePath || IMMUTABLE_KEY_NAME] = newData;
    } else if (type1 === "array" || type1 === "object") {
        changedValues = diff(oldData, newData);
    } else if (oldData !== newData) {
        changedValues[basePath || IMMUTABLE_KEY_NAME] = newData;
    }

    return [findPaths(changedValues), changedValues];
};

const isObject = (obj) => obj !== null && typeof obj === "object";

const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (isObject(obj1) && isObject(obj2)) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        for (let key of keys1) {
            if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
        }
        return true;
    }
    return false;
};

const diff1 = (oldData = {}, newData = {}, rel = "oldData") => {
    return Object.entries(oldData)
        .map(([k, v]) => {
            if (isObject(v) || isObject(newData[k])) return [k, diff1(v, newData[k], rel)];
            if (!deepEqual(newData[k], v)) return [k, { [rel]: v }];
            return [k, {}];
        })
        .filter(([, v]) => Object.keys(v).length !== 0)
        .reduce((o, [k, v]) => ((o[k] = v), o), Array.isArray(oldData) && Array.isArray(newData) ? [] : {});
};

const merge = (oldData = {}, newData = {}) => {
    return Object.entries(newData)
        .map(([k, v]) => (isObject(v) && isObject(oldData[k]) ? [k, merge(oldData[k], v)] : [k, v]))
        .reduce((o, [k, v]) => ((o[k] = v), o), oldData);
};

const diff = (x = {}, y = {}) => merge(diff1(x, y, "oldValue"), diff1(y, x, "newValue"));

const findPaths = (obj, basePath = "") => {
    const arr = [];

    Object.entries(obj).forEach(([key, value]) => {
        const isObject = typeof value === "object";
        if (isObject && ("oldValue" in value || "newValue" in value)) {
            arr.push(basePath ? `${basePath}.${key}` : key);
        } else if (isObject) {
            arr.push(...findPaths(value, basePath ? `${basePath}.${key}` : key));
        }
    });

    return arr;
};

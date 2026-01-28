import { typeOf } from "../typeOf";
const [maxKey, maxLevel] = [500, 10];

export const isEqual = (obj1, obj2, settings = {}, level = 0) => {
    const { treatFalsiesAsEqual } = settings;
    if (level > maxLevel) return false;
    if (obj1 === obj2) return true;
    if (treatFalsiesAsEqual) {
        if (!obj1 && !obj2) return true;
    }
    const [type1, type2] = [typeOf(obj1), typeOf(obj2)];
    if (type1 !== type2) return false;
    const jointType = type1;
    if (jointType === "function") return obj1.toString() === obj2.toString();
    if (jointType !== "object" && jointType !== "array") return false;
    const [len1, len2] = [
        obj1?.length || Object?.keys(obj1 || {})?.length || obj1?.toString()?.length || 0,
        obj2?.length || Object?.keys(obj2 || {})?.length || obj2?.toString()?.length || 0,
    ];
    if (len1 !== len2) return false;
    if (jointType === "object" && obj1?.hash && obj2.hash && obj1.hash === obj2.hash) return true;
    if (len1 > maxKey) return false;
    const [keys1, keys2] = [Object?.keys(obj1 || {}), Object?.keys(obj2 || {})];
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
        if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key], settings, level + 1)) return false;
    }
    return true;
};

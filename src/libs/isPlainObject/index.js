import { typeOf } from "../typeOf";

export const isPlainObject = (v) => {
    if (typeOf(v) !== "object") return false;
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
};

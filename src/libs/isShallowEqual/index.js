import { typeOf } from "../typeOf";
import { isPlainObject } from "../isPlainObject";

export const isShallowEqual = (a, b) => {
    if (Object.is(a, b)) return true;

    const ta = typeOf(a);
    const tb = typeOf(b);

    if (ta !== tb) return false;

    if (ta === "array") {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!Object.is(a[i], b[i])) return false;
        }
        return true;
    }

    if (ta === "object") {
        if (!isPlainObject(a) || !isPlainObject(b)) return false;

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!Object.is(a[key], b[key])) return false;
        }
        return true;
    }

    return false;
};

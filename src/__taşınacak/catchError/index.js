import { typeOf } from "../typeOf";

export const catchError = (arr) => {
    let error;
    arr.forEach((val) => {
        if (!val) return;

        const type = typeOf(val);

        if (type === "string") {
            error = val;
            return false;
        } else if (type === "array") {
            error = val[0];
            return false;
        } else if (type === "object") {
            const values = Object.values(val);
            error = values.join(" - ") || undefined;
            return false;
        } else if (type === "boolean") {
            error = Boolean(val);
            return false;
        }
    });

    return error;
};

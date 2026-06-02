import { isDeepEqual } from "../../isDeepEqual";
import { baseStore } from "../../baseStore";

export const validateField = ({ value, validationRules = [], field }) => {
    const { language, _validationRules } = baseStore.globalData.get();
    const errors = [];




    const childrenObj =
        field?.children && typeof field.children === "object" ? field.children : null;
    const childList = childrenObj ? Object.values(childrenObj) : [];

    let isDirty = childList.some((child) => child && child.isDirty === true);
    let isTouched = childList.some((child) => child && child.isTouched === true);
    let isValidGlobal = !childList.some((child) => child && child.isValid === false);

    if (childList.length > 0) {
        childList.forEach((child) => {
            if (!child) return;

            const childErrors = Array.isArray(child.errors) ? child.errors : [];
            if (childErrors.length < 1) return;

            childErrors.forEach((err) => {
                if (!err) return;

                const title = child?.label || child?.name || "Field";
                const text = String(err);

                const alreadyPrefixed = text.trim().startsWith("[");
                errors.push(alreadyPrefixed ? `[${title}].${text}` : `[${title}]: ${text}`);
            });
        });
    }




    if (!Array.isArray(validationRules) || validationRules.length < 1) {
        return [errors, isDirty, isValidGlobal, isTouched];
    }




    validationRules.forEach((rule) => {
        const ruleFunction = _validationRules?.[rule];

        if (typeof ruleFunction !== "function") {
            throw new Error(`Validation rule "${rule}" is not defined.`);
        }

        const res = ruleFunction({ value, field });
        const [isValid, msg] = Array.isArray(res) ? res : [true, ""];

        if (!isValid) {
            const message =
                typeof msg === "string" ? msg : msg && typeof msg === "object" ? msg[language] : "";
            if (message) errors.push(message);
            isValidGlobal = false;
        }
    });




    const selfDirty = !isDeepEqual(value, field?.defaultValue);
    isDirty = isDirty || selfDirty;
    isTouched = true;

    return [errors, isDirty, isValidGlobal, isTouched];
};

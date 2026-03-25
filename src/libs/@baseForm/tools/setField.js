import { byPath } from "../../byPath";
import { validateField } from "./validateField";

export const setField = ({ set, path, changes, isMainItem, name, validationRules, field }) => {
    if (!set || !path || !changes || typeof changes !== "object") return;

    const hasValue = Object.prototype.hasOwnProperty.call(changes, "value");

    const result = set((s) => {
        if (hasValue) {
            const [errors, isDirty, isValid, isTouched] = validateField({
                value: changes.value,
                validationRules,
                field,
            });

            const previousValue = byPath.get(s, `${path}.value`);
            if (previousValue === changes.value) return;

            byPath.set(s, `${path}.previousValue`, previousValue, true);
            byPath.set(s, `${path}.isTouched`, isTouched, true);
            byPath.set(s, `${path}.errors`, errors, true);
            byPath.set(s, `${path}.isDirty`, isDirty, true);
            byPath.set(s, `${path}.isValid`, isValid, true);

            if (isMainItem) {
                s.values ??= {};
                s.values[name] = changes.value;
            }
        }

        for (const key in changes) {
            if (!Object.prototype.hasOwnProperty.call(changes, key)) continue;
            byPath.set(s, `${path}.${key}`, changes[key], true);
        }
    });

    return result;
};

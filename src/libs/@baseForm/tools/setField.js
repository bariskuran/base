import { byPath } from "../../byPath";
import { validateField } from "./validateField";

const normalizeFieldPath = (path) => (path?.startsWith("fields.") ? path : `fields.${path}`);

export const setField = ({ set, path, changes, isMainItem, name, validationRules, field }) => {
    if (!set || !path || !changes || typeof changes !== "object") return;

    const fieldPath = normalizeFieldPath(path);
    const hasValue = Object.prototype.hasOwnProperty.call(changes, "value");

    const [errors, isDirty, isValid, isTouched] = validateField({
        value: changes.value,
        validationRules,
        field,
    });

    const result = set((s) => {
        if (hasValue) {
            const previousValue = byPath.get(s, `${fieldPath}.value`);
            if (previousValue === changes.value) return;

            byPath.set(s, `${fieldPath}.previousValue`, previousValue, true);
            byPath.set(s, `${fieldPath}.isTouched`, isTouched, true);
            byPath.set(s, `${fieldPath}.errors`, errors, true);
            byPath.set(s, `${fieldPath}.isDirty`, isDirty, true);
            byPath.set(s, `${fieldPath}.isValid`, isValid, true);

            if (isMainItem) {
                s.values ??= {};
                s.values[name] = changes.value;
            }
        }

        for (const key in changes) {
            if (!Object.prototype.hasOwnProperty.call(changes, key)) continue;
            byPath.set(s, `${fieldPath}.${key}`, changes[key], true);
        }
    });

    return result;
};

import { setField } from "./setField";
import { getField } from "./getField";
import { setFields } from "./setFields";
import { unmountForm } from "./unmountForm";
import { mountItem } from "./mountItem";
import { unmountItem } from "./unmountItem";
import { submitForm } from "./submitForm";
import { resetToDefaults } from "./resetToDefaults";
import { resetToLastSubmit } from "./resetToLastSubmit";
import { clearForm } from "./clearForm";
import { validateForm } from "./validateForm";
import { generateRandom } from "../../generateRandom";

export const mountForm = ({ store, formProps }) => {
    const { get, set } = store;
    const { formName = generateRandom.text(16) } = formProps || {};

    const currState = get() || {};
    if (currState.isFormMounted) return;

    set({
        ...formProps,


        fields: {},
        values: {},
        groupFields: {},


        setField: (args) => setField({ set, get, ...args }),
        getField: (args) => getField({ set, get, ...args }),
        setFields: (args) => setFields({ set, get, ...args }),


        unmountForm: () => unmountForm({ set }),
        mountItem: (args) => mountItem({ set, get, ...args }),
        unmountItem: (args) => unmountItem({ set, get, ...args }),


        submitForm: (args) => submitForm({ set, get, ...args }),
        resetToDefaults: (args) => resetToDefaults({ set, get, ...args }),
        resetToLastSubmit: (args) => resetToLastSubmit({ set, get, ...args }),
        clearForm: (args) => clearForm({ set, get, ...args }),


        validateForm: () => validateForm({ set, get }),


        isFormMounted: true,
        areFieldsMounted: false,
        _mountPulse: 0,
        _mountFlushScheduled: false,
        isValid: false,
        isTouched: false,
        isDirty: false,
        isSubmitting: false,


        errorFields: [],
        errorFieldLabels: [],
    });

    return true;
};

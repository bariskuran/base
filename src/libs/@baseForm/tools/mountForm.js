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

export const mountForm = ({ store, formProps }) => {
    const { get, set } = store;

    const currState = get() || {};
    if (currState.isFormMounted) return;

    set({
        ...formProps,

        // values
        fields: {},
        values: {},
        groupFields: {},

        // manuel yönetim için gerekli fonksiyonlar
        setField: (args) => setField({ set, get, ...args }), // field içindeki tüm değişkenleri yapabilen fonksiyon
        getField: (args) => getField({ set, get, ...args }), // field içindeki tüm değişkenleri yapabilen fonksiyon
        setFields: (args) => setFields({ set, get, ...args }), // bir obje alacak ve bulk set yapacak.

        // mount - unmounts
        unmountForm: () => unmountForm({ set }),
        mountItem: (args) => mountItem({ set, get, ...args }),
        unmountItem: (args) => unmountItem({ set, get, ...args }),

        // form tetikleri
        submitForm: (args) => submitForm({ set, get, ...args }),
        resetToDefaults: (args) => resetToDefaults({ set, get, ...args }),
        resetToLastSubmit: (args) => resetToLastSubmit({ set, get, ...args }),
        clearForm: (args) => clearForm({ set, get, ...args }),

        // validation
        validateForm: () => validateForm({ set, get }),

        // statuslar
        isFormMounted: true,
        areFieldsMounted: false,
        _mountPulse: 0,
        _mountFlushScheduled: false,
        isValid: false,
        isTouched: false,
        isDirty: false,
        isSubmitting: false,

        // error management
        errorFields: [],
        errorFieldLabels: [],
    });

    return true;
};

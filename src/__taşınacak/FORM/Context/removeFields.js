export const removeFields = (_formApi, arr = [], opts = {}) => {
    const { storeFile, formName, checkForm, onChangeFromForm, packageSender } = _formApi;
    const store = storeFile?.getState?.() || {};
    const form = store?.[formName] || {};
    const { fields, values } = form;

    const newFields = { ...fields };
    const newValues = { ...values };

    arr.forEach((name) => {
        delete newFields[name];
        delete newValues[name];
    });

    store.set({
        [formName + ".fields"]: newFields,
        [formName + ".values"]: newValues,
    });

    checkForm({ ...opts, sender: "removeFields" });
    onChangeFromForm;
    packageSender(onChangeFromForm, { skipDebounce: true });
};

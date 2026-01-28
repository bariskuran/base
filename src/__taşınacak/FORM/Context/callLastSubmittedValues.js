export const callLastSubmittedValues = (_formApi = {}, arr = [], opts = {}) => {
    const { storeFile, formName, setValues } = _formApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};

    const obj = {};

    (arr || []).forEach((fieldName) => {
        if (!fieldName) return;
        const { value, lastSubmittedValue } = fields[fieldName] || {};
        if (value === lastSubmittedValue) return;
        obj[fieldName] = lastSubmittedValue;
    });

    setValues(obj, { ...opts, sender: "callLastSubmittedValues" });
};

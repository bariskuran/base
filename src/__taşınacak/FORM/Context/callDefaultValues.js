export const callDefaultValues = (_formApi = {}, arr = [], opts = {}) => {
    const { storeFile, formName, setValues } = _formApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};
    const obj = {};

    (arr || []).forEach((fieldName) => {
        if (!fieldName) return;
        const { value, defaultValue } = fields[fieldName] || {};
        if (value === defaultValue) return;
        obj[fieldName] = defaultValue;
    });

    setValues(obj, { ...opts, sender: "callDefaultValues" });
};

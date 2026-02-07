export const clearValues = (_formApi = {}, arr = [], opts = {}) => {
    const { storeFile, formName, setValues } = _formApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};

    const obj = {};

    (arr || []).forEach((fieldName) => {
        if (!fieldName) return;
        const { value } = fields[fieldName] || {};
        if (value === null) return;
        obj[fieldName] = null;
    });

    setValues(obj, { ...opts, sender: "clearValues" });
};

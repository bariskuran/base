export const callPreviousValues = (_formApi = {}, arr = [], opts = {}) => {
    const { storeFile, formName, setValues, setPreviousValues } = _formApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};

    const newValues = {};
    const newPreviousValues = {};

    (arr || []).forEach((fieldName) => {
        if (!fieldName) return;
        const { value, previousValue } = fields[fieldName] || {};
        if (value === previousValue) return;
        newValues[fieldName] = previousValue;
        newPreviousValues[fieldName] = value;
    });

    setValues(newValues, { ...opts, sender: "callPreviousValues" });
    setPreviousValues(newPreviousValues, { ...opts, sender: "callPreviousValues" });
};

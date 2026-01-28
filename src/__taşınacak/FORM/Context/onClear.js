export const onClear = (_formApi = {}, _fieldApi = {}, opts = {}) => {
    const { storeFile, formName, callLastSubmittedValues, onClearFromForm } = _formApi;
    const { onClearFromField, packageSender } = _fieldApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};

    callLastSubmittedValues(Object.keys(fields), opts);
    packageSender([onClearFromField, onClearFromForm]);
};

export const onResetToLastSubmitted = (_formApi = {}, opts = {}) => {
    const { onClickFromField, ...restOpts } = opts;
    const { storeFile, formName, callLastSubmittedValues, packageSender } = _formApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};

    callLastSubmittedValues(Object.keys(fields), restOpts);
    packageSender(onClickFromField, { skipDebounce: true });
};

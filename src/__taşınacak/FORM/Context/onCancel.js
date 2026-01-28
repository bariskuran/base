export const onCancel = (_formApi = {}, opts = {}) => {
    const { onClickFromField, ...restOpts } = opts;
    const { storeFile, formName, onCancelFromForm, callLastSubmittedValues, packageSender } =
        _formApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};

    callLastSubmittedValues(Object.keys(fields), restOpts);
    packageSender([onCancelFromForm, onClickFromField], { skipDebounce: true });
};

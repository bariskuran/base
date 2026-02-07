export const onResetToDefaults = (_formApi = {}, opts = {}) => {
    const { onClickFromField, ...restOpts } = opts;
    const { storeFile, formName, callDefaultValues, packageSender } = _formApi;
    const store = storeFile?.getState?.() || {};
    const fields = store?.[formName]?.fields || {};

    callDefaultValues(Object.keys(fields), restOpts);
    packageSender(onClickFromField, { skipDebounce: true });
};

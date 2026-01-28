export const onSubmit = (_formApi = {}, opts = {}) => {
    const {
        storeFile,
        formName,
        onSubmitFromForm,
        packageSender,
        setLastSubmittedValues,
        searchParamsSet,
        useLS,
        useSearchParams,
    } = _formApi;
    const { onClickFromField, ...restOpts } = opts;

    const store = storeFile?.getState?.() || {};
    const form = store?.[formName] || {};
    if (!form) return;

    const { fields } = form || {};

    const lastSubmittedValuesObj = {};
    Object.entries(fields).forEach(([name, field]) => {
        const { value } = field || {};
        lastSubmittedValuesObj[name] = value;
    });

    setLastSubmittedValues(lastSubmittedValuesObj, restOpts);

    if (useLS === "onSubmit" || useSearchParams === "onSubmit") {
        const { isReadyOnAllConditionsMet } = storeFile?.getState?.()?.[formName] || {};
        if (!isReadyOnAllConditionsMet) return;
        searchParamsSet();
    }

    packageSender([onSubmitFromForm, onClickFromField], { skipDebounce: true });
};

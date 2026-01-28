export const setValues = (_formApi = {}, obj = {}, opts = {}) => {
    const { storeFile, formName, checkForm } = _formApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;
    const fields = store?.[formName]?.fields || {};
    const { silentMode, skipIsTouched, setLastSubmittedValue } = opts;

    if (!obj || Object.keys(obj).length === 0) return;

    Object.entries(obj).forEach(([name, newValue], index) => {
        if (!name) return;
        const { isTouched: fieldTouchValue } = fields?.[name] || {};

        set({
            [formName + ".fields." + name + ".value"]: newValue,
            [formName + ".values." + name]: newValue,

            ...(setLastSubmittedValue && {
                [formName + ".fields." + name + ".lastSubmittedValue"]: newValue,
            }),

            ...(!silentMode &&
                !skipIsTouched &&
                !fieldTouchValue && { [formName + ".fields." + name + ".isTouched"]: true }),

            ...(index === Object.keys(obj).length - 1 && {
                [formName + ".lastChangedField"]: name,
            }),
        });
    });

    checkForm({ ...opts, sender: "setValues" });
    return functionsAfterSet({ opts, _formApi });
};

const functionsAfterSet = (p = {}) => {
    const { opts = {}, _formApi = {} } = p;
    const { onSubmit, packageSender } = _formApi;

    const { submitAfterSet, returnResponse } = opts;
    if (!submitAfterSet && !returnResponse) return;
    const pack = packageSender(undefined, { justReturnPackAsResponse: true });

    if (submitAfterSet) {
        onSubmit?.();
    }

    if (returnResponse) {
        return pack;
    }
};

export const setLastSubmittedValues = (_formApi = {}, obj = {}, opts = {}) => {
    const { storeFile, formName, checkForm } = _formApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    Object.entries(obj).forEach(([key, value]) => {
        set({
            [formName + ".fields." + key + ".lastSubmittedValue"]: value,
            [formName + ".lastSubmittedValues." + key]: value,
        });
    });

    checkForm({ ...opts, sender: "setLastSubmittedValues" });
};

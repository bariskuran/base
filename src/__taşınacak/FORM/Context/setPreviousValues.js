export const setPreviousValues = (_formApi = {}, obj = {}, opts = {}) => {
    const { storeFile, formName, checkForm } = _formApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    Object.entries(obj).forEach(([key, value]) => {
        set({ [formName + ".fields." + key + ".previousValue"]: value });
    });

    checkForm({ ...opts, sender: "setPreviousValues" });
};

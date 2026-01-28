export const setDefaultValues = (_formApi = {}, obj = {}, opts = {}) => {
    const { storeFile, formName, checkForm } = _formApi;
    const { set } = storeFile?.getState?.() || {};

    Object.entries(obj).forEach(([name, value]) => {
        set({
            [formName + ".fields." + name + ".defaultValue"]: value,
        });
    });

    checkForm({ ...opts, sender: "setDefaultValues" });
};

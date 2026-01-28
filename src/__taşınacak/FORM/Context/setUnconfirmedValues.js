export const setUnconfirmedValues = (_formApi = {}, obj = {}) => {
    const { storeFile, formName } = _formApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    Object.entries(obj).forEach(([key, value]) => {
        set({ [formName + ".fields." + key + ".unconfirmedValue"]: value });
    });
};

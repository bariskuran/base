export const setFields = (_formApi = {}, obj = {}, opts = {}) => {
    const { storeFile, formName, setValues, checkForm } = _formApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    let count = 0;
    let objForSetValues = {};

    Object.entries(obj).forEach(([key, valueObj]) => {
        const currField = store[formName]?.fields?.[key] || {};
        const newObj = { ...valueObj };
        if (Object.keys(valueObj).includes("value")) {
            count++;
            objForSetValues[key] = newObj.value;
            delete newObj.value;
        }
        set({
            [formName + ".fields." + key]: {
                ...currField,
                ...newObj,
            },
        });
    });

    if (count > 0) setValues(objForSetValues);
    else checkForm({ ...opts, sender: "setFields" });
};

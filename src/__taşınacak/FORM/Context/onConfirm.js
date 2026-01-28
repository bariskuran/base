import { setUnconfirmedValues } from "./setUnconfirmedValues";

export const onConfirm = (_formApi = {}, _fieldApi = {}, onChangePack = {}) => {
    const { formName, storeFile, onChange } = _formApi;
    const { fieldType, fieldRef, mainFolder } = _fieldApi;

    if (fieldType === "button") {
        fieldRef?.current?.click?.();
    } else {
        const objForUnconfirmedValues = [];
        const store = storeFile?.getState?.() || {};
        const field = store?.[formName]?.fields?.[name] || {};
        const { value, unconfirmedValue } = field || {};
        if (value === unconfirmedValue) return;
        objForUnconfirmedValues[mainFolder] = null;
        setUnconfirmedValues(objForUnconfirmedValues);
        onChange(_fieldApi, {
            skipConfirmation: true,
            packFromField: {
                ...onChangePack,
                newValue: unconfirmedValue,
                mainFolder,
            },
        });
    }
};

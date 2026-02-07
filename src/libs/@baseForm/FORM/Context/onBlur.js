export const onBlur = (_formApi = {}, _fieldApi = {}, e) => {
    const { storeFile, formName, onBlurFromForm, packageSender } = _formApi;
    const { mainFolder, onBlurFromField } = _fieldApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    set({
        [formName + ".fields." + mainFolder + ".isFocused"]: false,
    });

    packageSender([onBlurFromForm, onBlurFromField], {
        e,
        _fieldApi,
        fieldName: mainFolder,
        skipDebounce: true,
    });
};

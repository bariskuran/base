export const onFocus = (_formApi = {}, _fieldApi = {}, e) => {
    const { storeFile, formName, onFocusFromForm, packageSender, checkForm } = _formApi;
    const { onFocusFromField, mainFolder } = _fieldApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    set({
        [formName + ".fields." + mainFolder + ".isFocused"]: true,
        [formName + ".fields." + mainFolder + ".isTouched"]: true,
    });

    const isTouched = store?.[formName]?.fields?.[mainFolder]?.isFocused;
    !isTouched && checkForm({ sender: "onFocus" });
    packageSender([onFocusFromForm, onFocusFromField], { e, _fieldApi, fieldName: mainFolder });
};

export const onHover = (_formApi = {}, _fieldApi = {}, e) => {
    const { storeFile, formName, onHoverFromForm, packageSender } = _formApi;
    const { mainFolder, onHoverFromField } = _fieldApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    set({
        [formName + ".fields." + mainFolder + ".isHovered"]: true,
        [formName + ".fields." + mainFolder + ".isTouched"]: true,
    });

    packageSender([onHoverFromForm, onHoverFromField], { e, _fieldApi, fieldName: mainFolder });
};

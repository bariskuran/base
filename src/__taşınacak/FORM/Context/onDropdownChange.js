export const onDropdownChange = (_formApi = {}, _fieldApi = {}, vis) => {
    const { storeFile, formName, packageSender } = _formApi;
    const { onDropdownVisibleChangeFromField, mainFolder } = _fieldApi;
    const store = storeFile?.getState?.() || {};
    const { set } = store;

    packageSender(onDropdownVisibleChangeFromField, {
        _fieldApi,
        fieldName: mainFolder,
        dropdownStatus: vis,
    });

    setTimeout(() => {
        set({ [formName + ".fields." + mainFolder + ".isDropdownOpen"]: vis });
    }, 250);
};

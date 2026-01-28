export const _mountForm = (_formApi = {}) => {
    const { storeFile, formName, checkIsReady } = _formApi;
    const state = storeFile?.getState?.() || {};

    // daha önceden kurulum yapılmış olabilir. kontrol et ve çık. üzerine yazmaları engellemiş olalım.
    if (state?.[formName]?.isFormMounted) {
        return;
    }

    state.set({
        [formName + "._formApi"]: _formApi,
        [formName + ".isFormMounted"]: true,
    });
    checkIsReady({ sender: "mountForm" });
};

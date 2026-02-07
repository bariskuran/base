export const _unmountForm = (_formApi = {}) => {
    const { storeFile, formName, disableUnmount } = _formApi;
    const state = storeFile?.getState?.() || {};

    if (disableUnmount) return;

    state.set({
        [formName + ".isFormMounted"]: false,
        [formName + ".isReadyOnAllConditionsMet"]: false,
    });
};

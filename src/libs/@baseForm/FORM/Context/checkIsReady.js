export const checkIsReady = (_formApi, opts) => {
    const { formName, storeFile, onReady } = _formApi || {};
    const state = storeFile?.getState?.() || {};
    const form = state?.[formName] || {};

    if (!form?.isLastFieldMounted || !form?.isFormMounted) return;

    state.set({ [formName + ".isReadyOnAllConditionsMet"]: true });
    onReady({ ...opts, sender: "checkIsReady" });
};

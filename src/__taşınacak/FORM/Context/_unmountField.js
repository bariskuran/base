export const _unmountField = (_formApi = {}, _fieldApi = {}) => {
    const { removeFields, disableUnmount } = _formApi;
    const { name, fieldType, syncWith, useAntDirectly } = _fieldApi;

    if (useAntDirectly) return;

    if (
        disableUnmount ||
        fieldType === "button" ||
        fieldType === "footer" ||
        fieldType === "buttonArea" ||
        syncWith
    )
        return;

    removeFields([name]);
};

import { debouncedFunction } from "../../debouncedFunction";

export const packageSender = (_formApi, funcs, additionalData = {}) => {
    const { skipDebounce, ...addData } = additionalData;

    if (skipDebounce) {
        return debounced(funcs, _formApi, addData);
    } else {
        const { formName, debounceTime } = _formApi;
        const fn = debouncedFunction(debounced, {
            delay: debounceTime,
            functionName: formName + "_packageSender",
        });
        return fn(funcs, _formApi, addData);
    }
};

const debounced = (funcs, _formApi, additionalData = {}) => {
    const { storeFile, formName } = _formApi;
    const store = storeFile?.getState?.() || {};
    const form = store?.[formName];
    const { justReturnPackAsResponse, ...restAddData } = additionalData;
    if (!form) return;

    const { fields, values, lastSubmittedValues } = form;
    const pack = {
        fields,
        values,
        lastSubmittedValues,
        _formApi,
        storeFile,
        ...restAddData,
    };

    if (justReturnPackAsResponse) return pack;
    if (!funcs) return;
    if (typeof funcs === "function") funcs?.(pack);
    else
        funcs.forEach((func) => {
            func?.(pack);
        });
};

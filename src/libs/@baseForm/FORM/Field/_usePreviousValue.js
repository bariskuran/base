import { useDebouncedValue } from "../../useDebouncedValue";
import { useEffect } from "react";

export const usePreviousValue = (p = {}) => {
    const { _fieldApi = {}, _formApi = {}, setStoreFile, triggerHook = true } = p;
    const { name, fieldType, value, defaultValue, deactivate } = _fieldApi;
    const { debounceTime, formName } = _formApi;

    const [dv_debouncedValue, dv_setValue, dv_value, , setInitial, isWaiting] = useDebouncedValue(
        value || defaultValue,
        {
            delay: debounceTime,
            triggerHook,
            getPrevious: true,
        },
    );

    /* Set Previous Value */
    useEffect(() => {
        if (fieldType === "button" || !triggerHook || deactivate) return;
        setStoreFile({ [formName + ".fields." + name + ".previousValue"]: dv_debouncedValue });
    }, [dv_debouncedValue]);

    useEffect(() => {
        if (fieldType === "button" || !triggerHook || dv_value === value || isWaiting) return;
        dv_setValue(value);
    }, [value, triggerHook]);

    /* Return */
    return [dv_setValue, setInitial];
};

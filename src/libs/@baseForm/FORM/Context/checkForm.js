import { debouncedFunction } from "../../debouncedFunction";
import { isEqual } from "../../isEqual";

export const checkForm = (_formApi = {}, opts = {}) => {
    const { storeFile } = _formApi;
    const { skipDebouncing } = opts;

    const { formSettings } = storeFile?.getState?.() || {};
    const { debounceTime } = formSettings || {};

    const runFn = debouncedFunction(debouncedCheckForm, {
        delay: skipDebouncing ? 0 : debounceTime,
        functionName: _formApi.formName + "_checkForm",
        // getFirst: true,
    });

    runFn(_formApi, opts);
};

const debouncedCheckForm = (
    _formApi,
    // opts
) => {
    const { storeFile, formName } = _formApi || {};
    // const { silentMode } = opts;
    const state = storeFile?.getState?.() || {};
    const form = state[formName] || {};
    if (!form) return;

    const { set } = state;
    const { isReadyOnAllConditionsMet, fields, values } = form;
    // if (formName === "form") console.log(state, fields, values);
    if (!isReadyOnAllConditionsMet) return;
    const errorFields = [];
    const errorFieldLabels = [];

    /*
        Check Fields
    */
    Object.entries(fields || {}).forEach(([name, field]) => {
        if (!name) return;
        const { rules, value, defaultValue, lastSubmittedValue, label } = field || {};
        let [isValid, errors, isRequired, isHidden] = [true, [], false, false];

        (rules || [])?.forEach((rule) => {
            if (typeof rule !== "function") return;
            const [ruleIsValid, ruleMsg, settings] = rule({
                value,
                fields,
                values,
                field,
                storeFile,
                _formApi,
            });

            if (!ruleIsValid) {
                isValid = false;
                errors.push(ruleMsg);

                if (!errorFields?.includes?.(name)) {
                    name && errorFields.push(name);
                    label && errorFieldLabels.push(label);
                }
            }

            const { setRequired, setHidden } = settings || {};
            if (setRequired) isRequired = setRequired;
            if (setHidden) isHidden = setHidden;
        });

        const isEqualSettings = { treatFalsiesAsEqual: true };
        const isDiff = isEqual(lastSubmittedValue, defaultValue, isEqualSettings); // isLastSubmittedValue is different than default Value
        const enableResetToLastSubmitted = isEqual(value, lastSubmittedValue, isEqualSettings);
        const enableResetToDefault = isEqual(value, defaultValue, isEqualSettings);

        const path = formName + ".fields." + name;
        set({
            [path + ".isValid"]: isValid,
            [path + ".errors"]: errors,
            [path + ".isRequired"]: isRequired || false,
            [path + ".isHidden"]: isHidden || false,
            [path + ".isDirty"]: !enableResetToLastSubmitted,
            [path + ".enableResetToLastSubmitted"]: !isDiff && !enableResetToLastSubmitted,
            [path + ".enableResetToDefault"]: !enableResetToDefault,
        });
    });

    /*
        Update Form controllers.
    */
    const newState = storeFile?.getState?.() || {};
    const newSet = newState.set || {};
    const newFields = newState?.[formName]?.fields || {};

    newSet({
        [formName + ".errorFields"]: errorFields,
        [formName + ".errorFieldLabels"]: errorFieldLabels,
        [formName + ".isValid"]: !Object.values(newFields).some((field) => !field.isValid),
        [formName + ".isTouched"]: Object.values(newFields).some((field) => field.isTouched),
        [formName + ".isDirty"]: Object.values(newFields).some((field) => field.isDirty),
        [formName + ".enableResetToLastSubmitted"]: Object.values(newFields).some(
            (field) => field.enableResetToLastSubmitted,
        ),
        [formName + ".enableResetToDefault"]: Object.values(newFields).some(
            (field) => field.enableResetToDefault,
        ),
    });
};

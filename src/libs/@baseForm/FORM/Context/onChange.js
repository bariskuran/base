import { baseStore } from "../../baseStore";

export const onChange = (_formApi = {}, _fieldApi = {}, settings = {}) => {
    const {
        storeFile,
        onChangeFromForm,
        setValues,
        useLS,
        useSearchParams,
        packageSender,
        formName,
        searchParamsSet,
        setUnconfirmedValues,
    } = _formApi;
    const {
        name: orjName,
        fieldType,
        fieldRef,
        onChangeFromField,
        confirmation,
        popoverId,
        activePopover,
        allowMultiple,
        syncWith,
        mainFolder,
        pathAfterMainFolder,
    } = _fieldApi;
    const { skipConfirmation, packFromField = {} } = settings;
    const {
        newValue,
        name: nameOverride,
        updatePreviousValueFunctionFromField,
        restInputProps,
    } = packFromField;
    const name = nameOverride || orjName;

    /**
     *
     * onChange confirmation steps
     *
     */
    if (confirmation && fieldType !== "button" && !skipConfirmation && !syncWith) {
        if (activePopover !== popoverId) {
            const { set: setBase } = baseStore?.getState() || {};
            setBase({ activePopover: popoverId });
        }
        setUnconfirmedValues({ [name]: newValue });
        if (fieldType === "select" && !allowMultiple) {
            fieldRef?.current?.blur();
        }
        return;
    }

    /**
     *
     * Regular onChange steps
     *
     */
    let valueOverride = newValue;
    if (syncWith) {
        const mainField = storeFile?.getState()?.[formName]?.values?.[mainFolder];
        valueOverride = setValueByPath(mainField, pathAfterMainFolder + "." + name, newValue);
    }
    setValues({ [syncWith ? mainFolder : name]: valueOverride });
    !syncWith && updatePreviousValueFunctionFromField(newValue); // syncWith fields doesn't support previousValue yet.

    const { silentMode } = settings || {};

    if (!silentMode) {
        packageSender([onChangeFromField, onChangeFromForm], {
            newValue: valueOverride,
            fieldName: mainFolder,
            skipDebounce: true,
        });
    }

    if (fieldType === "select" && !restInputProps.allowMultiple) {
        fieldRef?.current?.blur();
    }

    if (useLS === "onChange" || useSearchParams === "onChange") {
        const { isReadyOnAllConditionsMet } = storeFile?.getState?.()?.[formName] || {};
        if (!isReadyOnAllConditionsMet) return;
        searchParamsSet();
    }
};

const setValueByPath = (objOrArr, path, newValue) => {
    if (!path) return objOrArr;

    const pathArray = path.split(".");

    let result = objOrArr || (pathArray[0].includes("[") ? [] : {});

    const setValue = (current, parts, value) => {
        if (parts.length === 1) {
            const key = parts[0].replace(/[[\]]/g, "");
            current[key] = value;
            return current;
        }

        const [head, ...rest] = parts;
        const key = head.replace(/[[\]]/g, "");

        const nextIsArray = rest[0]?.includes("[");
        current[key] = current[key] || (nextIsArray ? [] : {});

        setValue(current[key], rest, value);
        return current;
    };

    return setValue(result, pathArray, newValue);
};

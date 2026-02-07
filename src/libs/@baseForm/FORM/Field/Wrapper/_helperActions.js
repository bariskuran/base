import { copyToClipboard } from "../../../copyToClipboard";
import { isEqual } from "../../../isEqual";

export const helperActions = (p = {}) => {
    const {
        _fieldApi: { name, fieldType, descriptionText, hideClear, multipleFields } = {},
        fieldState: { value, defaultValue, lastSubmittedValue, previousValue } = {},
        //
        _formApi: {
            setValues,
            callPreviousValues,
            callDefaultValues,
            callLastSubmittedValues,
            clearValues,
        } = {},
        formState: { values, fields } = {},
        //
        restInputProps: { options = [], valueKey = "value" } = {},
    } = p;

    /**
     *
     *
     * Actions
     *
     */
    const actions = [
        { label: descriptionText, icon: "question", hide: !descriptionText },
        {
            label: "Select All",
            icon: "selectAll",
            onClick: () => {
                let newSelected = [];
                if (fieldType === "checkbox") newSelected = options;
                else if (fieldType === "selectMultiple")
                    newSelected = options?.map((o) => o?.[valueKey]);
                setValues({ [name]: newSelected });
            },
            hide: fieldType !== "checkbox" || multipleFields,
        },
        {
            label: "Select None",
            icon: "selectNone",
            onClick: () => {
                setValues({ [name]: null });
            },
            hide: fieldType !== "checkbox" || multipleFields,
        },
        {
            label: "Copy Value",
            icon: "copy",
            onClick: () => {
                let pack;
                if (multipleFields) {
                    const keys = Object.keys(multipleFields);
                    const obj = {};
                    keys.forEach((k) => (obj[k] = values[k]));
                    pack = JSON.stringify(obj);
                } else pack = value;
                copyToClipboard(pack);
            },
            hide: !multipleFields ? !value : !Object.keys(multipleFields).some((k) => values?.[k]),
        },
        {
            label: "Clear Value",
            icon: "close",
            onClick: () => {
                if (multipleFields) {
                    const keys = Object.keys(multipleFields);
                    clearValues(keys);
                } else {
                    clearValues([name]);
                }
            },
            hide:
                hideClear ||
                !value ||
                fieldType === "checkbox" ||
                fieldType === "date" ||
                fieldType === "dateTime",
        },
        {
            label: "Use Previous Value",
            icon: "backFlip",
            onClick: () => {
                if (multipleFields) {
                    const keys = Object.keys(multipleFields);
                    callPreviousValues(keys);
                } else {
                    callPreviousValues([name]);
                }
            },
            hide: value === previousValue || !previousValue,
        },
        {
            label: "Use Default Value",
            icon: "reset",
            onClick: () => {
                if (multipleFields) {
                    const keys = Object.keys(multipleFields);
                    callDefaultValues(keys);
                } else {
                    callDefaultValues([name]);
                }
            },
            hide: !multipleFields
                ? defaultValue === null ||
                  defaultValue === undefined ||
                  isEqual(value, defaultValue, { treatFalsiesAsEqual: true })
                : Object.keys(multipleFields).every((key) =>
                      isEqual(values?.[key], fields?.[key]?.defaultValue, {
                          treatFalsiesAsEqual: true,
                      }),
                  ),
        },
        {
            label: "Use Last Submitted Value",
            icon: "reset",
            onClick: () => {
                if (multipleFields) {
                    const keys = Object.keys(multipleFields);
                    callLastSubmittedValues(keys);
                } else {
                    callLastSubmittedValues([name]);
                }
            },
            hide: !multipleFields
                ? lastSubmittedValue === null ||
                  lastSubmittedValue === undefined ||
                  isEqual(value, lastSubmittedValue, { treatFalsiesAsEqual: true })
                : Object.keys(multipleFields).every((key) =>
                      isEqual(values?.[key], fields?.[key]?.lastSubmittedValue, {
                          treatFalsiesAsEqual: true,
                      }),
                  ),
        },
    ];

    /**
     * Return actions that are not hidden
     */
    return actions.filter((it) => !it.hide);
};

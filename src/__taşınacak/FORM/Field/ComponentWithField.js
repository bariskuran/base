import { FieldContext } from "./FieldContext";
import { useContext } from "react";
import { useBase } from "../../useBase";
import { getValueByPath } from "../../getValueByPath";

export const ComponentWithField = () => {
    const [activePopover, setBase] = useBase((s) => [s.activePopover, s.set]);
    const {
        formState: { values } = {},
        formState = {},
        _formApi = {},
        _formApi: {
            storeFile,
            onClick,
            onChange,
            onClear,
            onFocus,
            onBlur,
            onHover,
            onDropdownChange,
            setDefaultValues,
        } = {},
        fieldState = {},
        fieldState: { value, unconfirmedValue } = {},
        _fieldApi = {},
        _fieldApi: {
            Component,
            fieldType,
            name,
            popoverId,
            confirmation,
            onClickFromField,
            syncWith,
            enableAbsoluteLabel,
            // onBlurFromField,
            // onChangeFromField,
            // onFocusFromField,
            // onPressEnterFromField,
            // onClearFromField,
            // onHoverFromField,
            // onDropdownVisibleChangeFromField,
        } = {},
        restInputProps,
        updatePreviousValueFunctionFromField,
    } = useContext(FieldContext);

    /**
     * Return
     * */
    if (!Component) return null;
    return (
        <Component
            fromField
            inputProps={restInputProps}
            storeFile={storeFile}
            _formApi={_formApi}
            formState={formState}
            enableAbsoluteLabel={enableAbsoluteLabel}
            {..._fieldApi}
            {...fieldState}
            /**
             *
             * OVERRIDES
             *
             */

            /* FIND VALUE */
            value={(() => {
                if (syncWith) return getValueByPath(values, syncWith + "." + name);
                if (confirmation && activePopover === popoverId) return unconfirmedValue;
                return value;
            })()}
            /* ONCHANGE */
            onChange={(val, incomingName) =>
                onChange(_fieldApi, {
                    packFromField: {
                        newValue: val,
                        name: incomingName || name,
                        updatePreviousValueFunctionFromField,
                        restInputProps,
                    },
                })
            }
            /* isLOADING */
            isLoading={
                // this is a hack for button and confirmation process
                fieldType === "button" && activePopover === popoverId ? true : _fieldApi.isLoading
            }
            /* ONCLICK */
            onClick={(e) => {
                // FORM.fields which are placed under a FORM.context doesn't support _formApi features such as confirmation.
                // At this condition, we hack that prop

                if (fieldType === "button" && Object.keys(_formApi).length === 0) {
                    if (confirmation && activePopover !== popoverId) {
                        setBase({ activePopover: popoverId });
                        e.preventDefault();
                        e.stopPropagation();
                    } else onClickFromField?.(_fieldApi, e);
                    return;
                }
                onClick?.(_fieldApi, e);
            }}
            /* CHANGE DEFAULT VALUE */
            changeDefaultValue={(newValue, incomingName) => {
                setDefaultValues({
                    [syncWith ? syncWith + "." + (incomingName || name) : incomingName || name]:
                        newValue,
                });
            }}
            /* OTHERS */
            onDropdownVisibleChange={(vis) => onDropdownChange(_fieldApi, vis)}
            onClear={() => onClear(_fieldApi)}
            onFocus={(e) => onFocus(_fieldApi, e)}
            onBlur={(e) => onBlur(_fieldApi, e)}
            onHover={(e) => onHover(_fieldApi, e)}
        />
    );
};

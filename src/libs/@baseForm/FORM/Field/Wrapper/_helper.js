import { useContext, useMemo } from "react";
import { FieldContext } from "../FieldContext";
import { V1 } from "../versions/V1";
import { V2 } from "../versions/V2";
import { helperActions } from "./_helperActions";

export const versions = { unstyled: V1, V1, V2 };

export const Helper = ({ children }) => {
    /**
     * Incoming Dataa
     */
    const {
        _fieldApi = {},
        _fieldApi: {
            helperVersion,
            disabled,
            name,
            label,
            labelIcon,
            debugMode,
            hideActions,
            disableHoverBackground,
            headerField,
        } = {},
        _formApi = {},
        _formApi: { setFields, justHeaderFields } = {},
        formState = {},
        formState: {
            errorFields,
            isDirty: isFormDirty,
            isTouched: isFormTouched,
            isReadyOnAllConditionsMet,
        } = {},
        fieldState = {},
        fieldState: {
            isRequired,
            isFocused,
            isDropdownOpen,
            isTouched,
            focusManually,
            errors,
        } = {},
        restInputProps = {},
    } = useContext(FieldContext);
    const Version = versions?.[helperVersion] || versions.unstyled;

    /**
     * Memorized helper actions
     * Dynamic props should be added here.
     */
    const memorizedHelperActions = useMemo(
        () => helperActions({ _fieldApi, fieldState, _formApi, formState, restInputProps }),
        [
            fieldState.value,
            fieldState.defaultValue,
            fieldState.lastSubmittedValue,
            fieldState.previousValue,
        ],
    );

    /**
     * Return
     * */
    return (
        <Version
            fieldState={fieldState}
            nonHeaderField={justHeaderFields && !headerField}
            label={label}
            labelIcon={labelIcon}
            debugMode={debugMode}
            name={name}
            isRequired={isRequired}
            errors={errors}
            hideActions={hideActions}
            conditionalStyledProps={{
                $disableHoverBackground: disableHoverBackground,
                $disabled: disabled,
                $isFieldFocused: isFocused,
                $hiddenError: (errors || [])?.length > 0,
                $semiHiddenError: (isFormTouched || isFormDirty) && (errors || [])?.length > 0,
                $isError:
                    (isFormTouched || isFormDirty) &&
                    errorFields?.[0] === name &&
                    (errors || [])?.length > 0,
            }}
            isReadyOnAllConditionsMet={isReadyOnAllConditionsMet}
            onOpenChange={(status) => {
                setFields({ [name]: { isFocused: status } });
            }}
            helperActions={memorizedHelperActions}
            onHelperClick={() => {
                setFields({
                    [name]: {
                        ...(!isDropdownOpen &&
                            !isFocused && {
                                focusManually: focusManually + 1,
                            }),
                        ...(!isTouched && { isTouched: true }),
                    },
                });
            }}
        >
            {children}
        </Version>
    );
};

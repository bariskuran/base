import { useRef } from "react";
import { V1 } from "./versions/V1";
import { useEffectAfterMount } from "../../../useEffectAfterMount";
import { Field } from "../../Field";

export const versions = { V1 };

const NumberField = (p) => <Field Component={Number} fieldType="number" {...p} />;
export default NumberField;

//
export const Number = (props = {}) => {
    const {
        onChange,
        onClick,
        onFocus,
        onBlur,
        value,
        fieldRef,
        fieldVersion,
        name,
        onPressEnterFromField,
        triggerSubmitOnEnter,
        focusManually,
        _formApi: { onSubmit } = {},
        inputProps: {
            formatter = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            parser = (value) => value?.replace(/\$\s?|(,*)/g, ""),
            min,
            max,
            ...otherInputProps
        } = {},
        fromField,
        ...restProps
    } = props;
    const Comp = versions?.[fieldVersion] || versions.V1;
    const innerRef = useRef(null);

    /* Effects */
    useEffectAfterMount(() => {
        if (focusManually === 0) return;
        fieldRef.current?.focus();
    }, [focusManually]);

    /* onPressEnter */
    const onPressEnter = (e) => {
        onPressEnterFromField?.(e);
        fieldRef.current?.blur();
        innerRef.current?.blur();
        if (triggerSubmitOnEnter) {
            onSubmit?.();
        }
    };

    /* handleKeyPress */
    const handleKeyPress = (e) => {
        const charCode = e.charCode || e.keyCode;
        const inputValue = e.target.value;
        const newChar = String.fromCharCode(charCode);
        // Allow numbers (0-9), backspace, decimal point, minus sign, and other navigation keys
        if (
            (charCode < 48 || charCode > 57) && // Not a number
            charCode !== 46 && // Not a decimal point
            charCode !== 45 && // Not a minus sign
            charCode !== 8 && // Not backspace
            !(charCode >= 37 && charCode <= 40) // Not arrow keys
        ) {
            e.preventDefault();
        }

        const potentialValue = inputValue + newChar;
        const numericValue = parseFloat(potentialValue);

        if (!isNaN(numericValue)) {
            if (min !== undefined && numericValue < min) {
                e.preventDefault();
            }

            if (max !== undefined && numericValue > max) {
                e.preventDefault();
            }
        }
    };

    /* Return */
    return (
        <Comp
            // from FormField
            formatter={formatter}
            parser={parser}
            //
            ref={fieldRef}
            value={value}
            onChange={(e) => {
                onChange(e, name);
            }}
            onKeyPress={handleKeyPress}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={onClick}
            onPressEnter={onPressEnter}
            // rest
            {...(fromField ? otherInputProps : restProps)}
        />
    );
};

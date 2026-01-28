import { useRef } from "react";
import { V1 } from "./versions/V1";
import { V2 } from "./versions/V2";
import { useEffectAfterMount } from "../../../useEffectAfterMount";
import { Field } from "../../Field";

export const versions = { V1, V2 };

const InputField = (p) => <Field Component={Input} fieldType="input" {...p} />;
export default InputField;

export const Input = (p = {}) => {
    const {
        onChange,
        onClick,
        onFocus,
        onBlur,
        value,
        fieldRef,
        fieldVersion,
        name,
        label,
        onPressEnterFromField,
        triggerSubmitOnEnter,
        focusManually,
        _formApi: { onSubmit } = {},
        inputProps,
        fromField,
        ...rest
    } = p;

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

    /* Return */
    return (
        <Comp
            placeholder={fieldVersion === "V1" ? "" : label}
            ref={fieldRef || innerRef}
            value={value}
            onChange={(e) => {
                onChange(e?.target?.value, name);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={onClick}
            onPressEnter={onPressEnter}
            allowClear={false} // fieldHelper does it have it own Clear functionality Do not use that.
            // rest
            {...(fromField ? inputProps : rest)}
        />
    );
};

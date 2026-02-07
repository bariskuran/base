import { V1 } from "./versions/V1";
import { Radio as RadioOrj } from "antd";
import { Field } from "../../Field";

const versions = { V1 };

const RadioField = (p) => <Field Component={Radio} fieldType="radio" {...p} />;
export default RadioField;

//
export const Radio = (p = {}) => {
    const {
        onChange,
        onClick,
        // onFocus,
        // onBlur,
        value,
        fieldRef,
        fieldVersion,
        name,
        inputProps: { options, ...restInputProps } = {},
        fromField,
        ...restP
    } = p;

    /* */
    const Version = versions?.[fieldVersion] || versions.V1;
    return (
        <Version>
            <RadioOrj.Group
                ref={fieldRef}
                onClick={onClick}
                onChange={(e) => onChange(e?.target?.value, name)}
                value={value}
                // rest
                {...(fromField ? restInputProps : restP)}
            >
                <div id="container">
                    {options.map((item, index) => {
                        const { label, value, ...rest } = item || {};
                        return (
                            <RadioOrj key={index} value={value} {...rest}>
                                {label}
                            </RadioOrj>
                        );
                    })}
                </div>
            </RadioOrj.Group>
        </Version>
    );
};

import { Switch as SwitchOrj } from "antd";
import { V1 } from "./versions/V1";
import { useEffectAfterMount } from "../../../useEffectAfterMount";
import { Icon } from "../../../Icon";
import { Field } from "../../Field";

const versions = { V1 };

const SwitchField = (p) => <Field Component={Switch} fieldType="switch" {...p} />;
export default SwitchField;

//
export const Switch = (p = {}) => {
    const {
        fromField,
        onChange,
        onClick: onClickFromForm,
        onFocus,
        onBlur,
        value,
        fieldRef,
        fieldVersion,
        name,
        focusManually,
        inputProps: {
            checkedChildren = (
                <>
                    <Icon icon="check" width={14} color="success" style={{ marginRight: 10 }} />
                    Yes
                </>
            ),
            unCheckedChildren = (
                <>
                    <Icon icon="close" width={10} color="error" style={{ marginRight: 10 }} />
                    No
                </>
            ),
            ...restInputProps
        } = {},
        ...restP
    } = p;

    useEffectAfterMount(() => {
        if (focusManually === 0) return;
        onChange(!value);
    }, [focusManually]);

    const onClick = (e) => {
        onClickFromForm?.(e);
        fieldRef?.current?.blur();
    };

    /* */
    const Version = versions?.[fieldVersion] || versions.V1;
    return (
        <Version>
            <SwitchOrj
                ref={fieldRef}
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onClick}
                onChange={(v) => onChange(v, name)}
                {...{
                    value,
                    checkedChildren,
                    unCheckedChildren,
                }}
                {...(fromField ? restInputProps : restP)}
            />
        </Version>
    );
};

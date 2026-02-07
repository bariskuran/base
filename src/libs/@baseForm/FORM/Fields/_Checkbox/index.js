import { V1 } from "./versions/V1";
import { FORM } from "../../FORM";
import { Checkbox as CheckboxOrj } from "antd";

const versions = { V1 };

export const FieldCheckbox = ({ form, ...rest }) => (
    <FORM.field form={[Checkbox, "checkbox", form?.[0], form?.[1]]} {...rest} />
);

export const Checkbox = (props) => {
    const { fieldVersion, value, name, inputProps = {}, onChange } = props;
    const { options = [] } = inputProps;

    /* */
    const Version = versions?.[fieldVersion] || versions.V1;
    return (
        <Version>
            <CheckboxOrj.Group
                onChange={(val) => {
                    onChange(val, name);
                }}
                value={value}
            >
                <div id="container">
                    {options.map((item, index) => (
                        <CheckboxOrj key={index} value={item}>
                            {item}
                        </CheckboxOrj>
                    ))}
                </div>
            </CheckboxOrj.Group>
        </Version>
    );
};

import { V1 } from "./versions/V1";
import { FORM } from "../../FORM";
import { Rate as RateOrj } from "antd";

const versions = { V1 };

export const FieldRate = ({ form, ...rest }) => (
    <FORM.field form={[Rate, "rate", form?.[0], form?.[1]]} {...rest} />
);

export const Rate = (props) => {
    const { fieldVersion, value, name, inputProps = {}, onChange } = props;
    const { allowHalf = true, count = 10, ...restOfInputProps } = inputProps;

    /* Return */
    const Version = versions?.[fieldVersion] || versions.V1;
    return (
        <Version>
            <RateOrj
                allowHalf={allowHalf}
                value={value}
                onChange={(val) => onChange(val, name)}
                count={count}
                {...restOfInputProps}
            />
            <div id="label">{value || 0}</div>
        </Version>
    );
};

import { useRef } from "react";
import { V1 } from "./versions/V1";
import { FORM } from "../../FORM";
import { Slider as SliderOrj } from "antd";
import { Number } from "../Number";

const versions = { V1 };

export const FieldSlider = ({ form, ...rest }) => (
    <FORM.field form={[Slider, "slider", form?.[0], form?.[1]]} {...rest} />
);

export const Slider = ({ fieldVersion, value, name, inputProps, onChange }) => {
    const inputRef = useRef(null);

    const { min = 0, max = 100, step = 1, ...restInputProps } = inputProps || {};

    const onFieldChange = (val) => {
        onChange(val, name);
    };

    /* */
    const Version = versions?.[fieldVersion] || versions.V1;
    return (
        <Version>
            <div id="slider">
                <SliderOrj
                    value={value}
                    onChange={onFieldChange}
                    {...{ ...restInputProps, min, max, step }}
                />
            </div>
            <div id="inputArea">
                <Number
                    fieldVersion="V1"
                    onChange={onFieldChange}
                    fieldRef={inputRef}
                    value={value || 0}
                    inputProps={{ min, max, step }}
                />
            </div>
        </Version>
    );
};

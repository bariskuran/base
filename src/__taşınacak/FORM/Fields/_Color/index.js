import { useRef } from "react";
import { V1 } from "./versions/V1";
import { FORM } from "../../FORM";
import { ColorPicker as ColorPickerOrj } from "antd";
import { useDS } from "../../useDashStore";
import { useEffectAfterMount } from "../../useEffectAfterMount";
import { Input } from "../Input";

const versions = { V1 };

export const FieldColor = ({ form, ...rest }) => (
    <FORM.field form={[Color, "color", form?.[0], form?.[1]]} {...rest} />
);

export const Color = ({ focusManually, fieldVersion, value, name, inputProps, onChange }) => {
    const { isOpen, set } = useDS({ isOpen: false });
    const inputRef = useRef(null);
    const switchOpen = () => {
        set({ isOpen: !isOpen });
    };

    const onInnerChange = (hex) => {
        onChange(hex?.toHexString(), name);
    };

    const onOpenChange = (open) => {
        set({ isOpen: open });
    };

    useEffectAfterMount(() => {
        if (focusManually === 0) return;
        switchOpen();
    }, [focusManually]);

    const onInputChange = (val) => {
        let checkedVal = val;
        if (checkedVal && !checkedVal.startsWith("#")) checkedVal = "#" + checkedVal;
        if (checkedVal.length > 7) checkedVal = checkedVal.slice(0, 7);
        checkedVal = checkedVal.replace(/[^#0-9A-Fa-f]/g, "");
        onChange(checkedVal, name);
    };

    /* */
    const Version = versions?.[fieldVersion] || versions.V1;
    return (
        <Version $color={value}>
            <div id="colorBox" onClick={switchOpen} />
            <div id="picker" onClick={switchOpen}>
                <ColorPickerOrj
                    value={value}
                    open={isOpen}
                    trigger="click"
                    onChange={onInnerChange}
                    onOpenChange={onOpenChange}
                    {...inputProps}
                />
            </div>
            <div id="inputArea" onClick={switchOpen}>
                <Input
                    value={value}
                    ver="V1"
                    inputProps={{ placeholder: "transparent" }}
                    onChange={onInputChange}
                    fieldRef={inputRef}
                    onBlur={() => {
                        set({ isOpen: false });
                    }}
                />
            </div>
        </Version>
    );
};

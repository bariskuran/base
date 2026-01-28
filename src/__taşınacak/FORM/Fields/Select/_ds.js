import { useDS } from "../../useDashStore";
import S, { Syntax, versionsToArray } from "../../DesignSystem/navigationStyles";
import { Select, versions } from "./";

const options = [
    { id: 1, label: "Option 1", value: "Value 3" },
    { id: 2, label: "Option 2", value: "Value 2" },
    { id: 3, label: "Option 3", value: "Value 1" },
];
const vers = versionsToArray(versions);

export const Ds = () => {
    const { sel1, sel2, sel3, sel4, selectedVer, set } = useDS({ selectedVer: "V1" });

    /* */
    return (
        <S.container>
            <S.title>{"<Select>"}</S.title>
            <S.description>
                <p>
                    <span>
                        Form fields don't support
                        <S.h>confirmation, validation check, isTouched etc</S.h> when they used
                        alone. These features come from <S.h>Field</S.h> component. Using this
                        component directly is not recommended. Checkout Field component too.
                    </span>
                </p>
            </S.description>
            <Syntax>{`
import { FORM } from "dash";
<FORM.select form = {[label, name, ver]} // ... other props
<FORM.selectMultiple form = {[label, name, ver]} // ... other props

import { Select } from "dash";
<Select ver, value, onChange, inputProps = {{}} /> // Put field props inside inputProps.

// JOINT PROPS
    labelKey
    valueKey
    options={}
    value={} // Not mandatory when used with the <Field> component.
    onChange={(value)=>} // Not mandatory when used with the <Field> component.
    orderBy="" // default is labelKey
    orderByDirection="" // default is "asc". "desc" is also possible
    searchAt={[]} // determines which props the search will look for. {["id", "label"]}. default is labelKey            
`}</Syntax>
            <Select
                label="Versions"
                options={vers}
                value={selectedVer}
                onChange={(v) => set({ selectedVer: v })}
                ver={selectedVer}
            />
            <S.subtitle>Tests</S.subtitle>
            <S.f $direction="column">
                <Select
                    label="Search At Test"
                    options={options}
                    value={sel1}
                    labelKey="value" // "label" is default
                    valueKey="id" // "value" is default
                    onChange={(v) => set({ sel1: v })}
                    ver={selectedVer}
                    //
                    orderBy="label"
                    orderByDirection="asc"
                    searchAt={["label", "value"]}
                />
                <Select
                    label="Multiple Test"
                    options={options}
                    value={sel2}
                    ver={selectedVer}
                    //
                    onChange={(v) => set({ sel2: v })}
                    allowMultiple
                />
                <Select
                    label="allowClear False"
                    options={options}
                    value={sel3}
                    onChange={(v) => set({ sel3: v })}
                    ver={selectedVer}
                />
                <Select
                    label="optionButtons Test"
                    options={options}
                    value={sel4}
                    ver={selectedVer}
                    //
                    onChange={(v) => set({ sel4: v })}
                    allowMultiple
                    dropdownActions={[
                        {
                            ver: "V2",
                            onClick: () => console.log("add"),
                            preIcon: "add",
                            primary: true,
                        },
                        { ver: "V2", onClick: () => console.log("che"), preIcon: "check" },
                    ]}
                />
            </S.f>
        </S.container>
    );
};

import { useEffect } from "react";
import { useBaseForm } from "./";
import { baseStore } from "../@baseStore/";

const store1 = baseStore.create();

export const BaseFormTest = () => {
    const { BaseForm, BaseFormGroup, BaseFormItem, values, fields } = useBaseForm({
        // store: null,
        store: store1,
        getLabelsByGetText: false,
    });

    useEffect(() => {
        console.log(values, fields);
    }, [values, fields]);

    return (
        <>
            <BaseForm>
                <BaseFormGroup
                    label="Full Name"
                    name="fullName2"
                    deriveValue={({ childrenValues }) => `Full Name: ${childrenValues.fullName}`}
                >
                    <BaseFormGroup
                        label="Full Name"
                        name="fullName"
                        deriveValue={({ childrenValues }) =>
                            childrenValues.firstName + " " + childrenValues.lastName
                        }
                        // flexColumn={true} // default is row.
                    >
                        <BaseFormGroup name="level2_a" placeholder="John">
                            <BaseFormItem
                                name="level3_a"
                                componentName="input"
                                defaultValue="333-222-444"
                                onChange={({ values, subValues, _api }) =>
                                    console.log("phone changed:", values, subValues, _api)
                                }
                                placeholder="555-555"
                            />
                        </BaseFormGroup>
                        <BaseFormItem.textArea name="firstName" defaultValue="John" />
                        <BaseFormItem.textArea
                            name="lastName"
                            label="label"
                            defaultValue="Doe"
                            deriveValue={({ value }) => (value ? value.toUpperCase() : "")}
                            validationRules={["hasToBeFilled", "hasToBeAValidEmail"]}
                            // handlers
                            // onChange={(props) => console.log("onChange", props)} - yapıldı.
                            // onFocus={(props) => console.log("focus", props)} - yapıldı.
                            // onBlur={(props) => console.log("blur", props)} - yapıldı.
                            // onKeyEnter={(props) => console.log("key enter", props)} - yapıldı.
                            // onKeyDown={(props) => console.log("key down", props)} - yapıldı.
                            // onKeyUp={(props) => console.log("key up", props)} - yapıldı.
                            // onPaste={(props) => console.log("paste", props)} - yapıldı.
                            // onClear={(props) => console.log("clear", props)} - yapıldı.
                            // onMouseEnter={(props) => console.log("mouse enter", props)} - yapıldı.
                            // onMouseLeave={(props) => console.log("mouse leave", props)} - yapıldı.
                            // onDropdownStatusChange={(props) => console.log("dropdown status change", props)} - dropdown olunca yapılacak.
                            // ui
                            // helperMode="enabled" // enabled, disabled, auto -- yapıldı.
                            // flexColumn={true} // default is row. -- yapıldı.
                            prefix={{
                                icon: "user",
                                onClick: (props) => console.log("click pre icon", props),
                                href: "https://www.google.com",
                            }}
                            suffix={{
                                icon: "eye",
                                onClick: (props) => console.log("click suf icon", props),
                            }}
                            // disabled={true} -- yapıldı.
                            // hidden={true} -- yapıldı.
                            autoFocus={true}
                            placeholder="test"
                            description="description"
                            tooltip="tooltip"
                            variant="amedist1"
                        />
                    </BaseFormGroup>
                </BaseFormGroup>
                <BaseFormItem.textArea label="test2" name="test2" defaultValue="test2" />
                <BaseFormItem.textArea label="test3" name="test3" defaultValue="test3" />
                <BaseFormItem.textArea label="test4" name="test4" defaultValue="test4" />
                <BaseFormItem
                    name="level1_b"
                    componentName="input"
                    defaultValue="444-444-444"
                    onChange={({ values, subValues, _api }) =>
                        console.log("phone changed:", values, subValues, _api)
                    }
                />
                <BaseFormItem
                    label="anorherArea"
                    name="level1_d"
                    componentName="input"
                    onChange={({ values, subValues, _api }) =>
                        console.log("tel changed:", values, subValues, _api)
                    }
                    defaultValue="hebele"
                />
                <BaseFormItem
                    label="anorherArea"
                    name="level1_d"
                    componentName="input"
                    onChange={({ values, subValues, _api }) =>
                        console.log("tel changed:", values, subValues, _api)
                    }
                    defaultValue="hebele"
                />
            </BaseForm>
            <SecondForm />
        </>
    );
};

const SecondForm = () => {
    const { BaseForm, BaseFormItem } = useBaseForm({
        // store: null,
        store: store1,
        getLabelsByGetText: true,
    });

    /* Return */
    return (
        <BaseForm>
            <div>
                {/* <BaseFormItem name="level1_c" componentName="input" /> */}
                <BaseFormItem
                    label="anorherArea"
                    name="level1_d"
                    componentName="input"
                    onChange={({ values, subValues, _api }) =>
                        console.log("tel changed:", values, subValues, _api)
                    }
                    defaultValue="hebele"
                />
            </div>
        </BaseForm>
    );
};

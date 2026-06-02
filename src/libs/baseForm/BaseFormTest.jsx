import { useEffect } from "react";
import { useBaseForm } from "./";
import { baseStore } from "../baseStore/";

const store1 = baseStore.create();

export const BaseFormTest = () => {
    const { BaseForm, BaseFormGroup, BaseFormItem, values, fields } = useBaseForm({

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















                            prefix={{
                                icon: "user",
                                onClick: (props) => console.log("click pre icon", props),
                                href: "https://www.google.com",
                            }}
                            suffix={{
                                icon: "eye",
                                onClick: (props) => console.log("click suf icon", props),
                            }}


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

        store: store1,
        getLabelsByGetText: true,
    });

    /* Return */
    return (
        <BaseForm>
            <div>
                {}
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

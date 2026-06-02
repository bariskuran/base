import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useBaseForm } from ".";
import { baseStore } from "../baseStore";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { formatJsonForDisplay } from "../DesignSystem/formatJsonForDisplay";

const formStore = baseStore.create();

const FormDemo = () => {
    const { BaseForm, BaseFormItem, values, isValid, isDirty, submitForm, resetToDefaults } =
        useBaseForm({
            store: formStore,
            formName: "dsDemoForm",
        });

    return (
        <Flex.column gap={12} full maxWidth={420}>
            <BaseForm>
                <BaseFormItem.textArea
                    name="email"
                    label="Email"
                    defaultValue=""
                    placeholder="you@example.com"
                    validationRules={["hasToBeFilled", "hasToBeAValidEmail"]}
                />
                <BaseFormItem.textArea
                    name="note"
                    label="Note"
                    defaultValue=""
                    placeholder="Optional message"
                />
            </BaseForm>
            <Flex gap={8} wrap>
                <Button.plain label="submitForm()" onClick={() => submitForm?.()} />
                <Button.plain label="resetToDefaults()" onClick={() => resetToDefaults?.()} />
            </Flex>
            <Typo.span>{`isValid: ${String(isValid)} · isDirty: ${String(isDirty)}`}</Typo.span>
            <Typo.code codeFormat={false}>{formatJsonForDisplay(values ?? {})}</Typo.code>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="baseForm"
        releasedOn="Beta"
        description={
            <>
                Mounts a form store with <Typo.code>BaseForm</Typo.code>,{" "}
                <Typo.code>BaseFormItem</Typo.code>, nested groups, validation, and submit helpers.
                Global defaults merge from{" "}
                <Typo.code>baseStore.globalData._baseFormSettings</Typo.code>.
            </>
        }
    >
        <Ds.block
            title="Basic form"
            description="Pass a baseStore.create() instance or omit store to use an internal local store. BaseFormItem.textArea and .dropdown shortcuts come from inputComponents."
            code={`import { useBaseForm } from "${SYS.basePath}";
                   import { baseStore } from "${SYS.basePath}";

                       const store = baseStore.create();
                       const { BaseForm, BaseFormItem, values, submitForm } = useBaseForm({ store });

                       return (
                       <BaseForm>
                       <BaseFormItem.textArea name="email" label="Email" validationRules={["hasToBeFilled"]} />
                       </BaseForm>
                       );`}
            example={<FormDemo />}
        />
        <Ds.api
            args="const { BaseForm, BaseFormItem, BaseFormGroup, values, fields, submitForm, ...state } = useBaseForm({ store, ...formProps });"
            props={{
                store: {
                    description: "Optional baseStore instance from baseStore.create().",
                    type: "store",
                },
                formName: {
                    description: "Stable form identifier stored on the form state.",
                    type: "string",
                },
                getLabelsByGetText: {
                    description: "When true, resolves labels through getText.",
                    type: "boolean",
                    defaultValue: "false",
                },
            }}
            returnProps={{
                BaseForm: { description: "Root form container.", type: "React component" },
                BaseFormItem: {
                    description: "Field wrapper with .textArea and .dropdown variants.",
                    type: "React component",
                },
                BaseFormGroup: { description: "Alias of BaseFormItem for nested groups.", type: "React component" },
                values: { description: "Current flattened field values.", type: "object" },
                fields: { description: "Mounted field metadata map.", type: "object" },
                submitForm: { description: "Validates and submits the form.", type: "fn" },
                resetToDefaults: { description: "Resets values to defaults.", type: "fn" },
                isValid: { description: "True when all validation rules pass.", type: "boolean" },
                isDirty: { description: "True after any value change.", type: "boolean" },
            }}
        />
        <Ds.api
            title="BaseFormItem.textArea"
            disableLastBlock
            args="<BaseFormItem.textArea name label defaultValue validationRules onChange deriveValue />"
            props={{
                name: { description: "Field path segment.", type: "string", required: true },
                label: { description: "Visible label.", type: "string" },
                validationRules: {
                    description: 'Rule names such as "hasToBeFilled", "hasToBeAValidEmail".',
                    type: "string[]",
                },
                deriveValue: {
                    description: "Optional ({ value, childrenValues }) => nextValue transform.",
                    type: "fn",
                },
            }}
        />
    </Ds.page>
);

export default X;

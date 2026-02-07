import { Button } from "../Button";
import { Field } from "../../Field";

const ButtonCancelField = (p) => <Field Component={C} fieldType="button" {...p} />;
export default ButtonCancelField;

// This can not be used as a seperate component. It needs Field.
const C = (props = {}) => {
    const {
        onClickFromField,
        _formApi: { onCancel } = {},
        formState: { isDirty } = {},
        fieldRef,
        fieldVersion,
        inputProps: { buttonVersion, hideTitle, ...rest } = {},
    } = props;

    const version = buttonVersion || fieldVersion;

    /* Return */
    return (
        <Button
            {...(!hideTitle && { label: "Cancel" })}
            preIcon="close"
            disabled={version === "V1" ? false : !isDirty}
            fieldVersion={version}
            onClick={(e) => {
                onCancel({ e, onClickFromField });
            }}
            fieldRef={fieldRef}
            {...rest}
        />
    );
};

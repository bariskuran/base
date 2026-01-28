import { Button } from "../Button";
import { Field } from "../../Field";

const ButtonResetToDefaultsField = (p) => <Field Component={C} fieldType="button" {...p} />;
export default ButtonResetToDefaultsField;

// This can not be used as a seperate component. It needs Field.
const C = (props = {}) => {
    const {
        onClickFromField,
        _formApi: { onResetToDefaults } = {},
        formState: { enableResetToDefault } = {},
        fieldRef,
        fieldVersion,
        inputProps: { buttonVersion, hideTitle, ...rest } = {},
    } = props;

    /* Return */
    return (
        <Button
            {...(!hideTitle && { label: "Defaults" })}
            preIcon="reset"
            disabled={!enableResetToDefault}
            fieldVersion={buttonVersion || fieldVersion}
            onClick={(e) => {
                onResetToDefaults({ e, onClickFromField });
            }}
            fieldRef={fieldRef}
            {...rest}
        />
    );
};

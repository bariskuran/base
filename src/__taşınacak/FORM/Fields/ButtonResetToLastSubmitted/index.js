import { Button } from "../Button";
import { Field } from "../../Field";

const ButtonResetToLastSubmittedField = (p) => <Field Component={C} fieldType="button" {...p} />;
export default ButtonResetToLastSubmittedField;

// This can not be used as a seperate component. It needs Field.
const C = (props = {}) => {
    const {
        _formApi: { onResetToLastSubmitted } = {},
        formState: { enableResetToLastSubmitted } = {},
        fieldRef,
        fieldVersion,
        inputProps: { buttonVersion, hideTitle, ...rest } = {},
    } = props;

    /* Return */
    return (
        <Button
            {...(!hideTitle && { label: "Last Submitted" })}
            preIcon="back"
            disabled={!enableResetToLastSubmitted}
            fieldVersion={buttonVersion || fieldVersion}
            onClick={onResetToLastSubmitted}
            fieldRef={fieldRef}
            {...rest}
        />
    );
};

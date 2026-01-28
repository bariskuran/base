import { ButtonArea } from "../../ButtonArea";
import ButtonCancelField from "../../ButtonCancel";
import ButtonSubmitField from "../../ButtonSubmit";

export const V2 = (p = {}) => {
    const {
        onCancel,
        onSubmit,
        formState: { isDirty, isReadyOnAllConditionsMet } = {},
        fieldVersion,
    } = p;

    /* */
    if (!isReadyOnAllConditionsMet || !isDirty) return null;
    return (
        <ButtonArea gap={0} margin={0} width="max-content">
            <ButtonCancelField
                buttonVersion={fieldVersion || "V2"}
                hideTitle
                headerField
                onClick={onCancel}
            />
            <ButtonSubmitField
                buttonVersion={fieldVersion || "V2"}
                hideTitle
                headerField
                onClick={onSubmit}
            />
        </ButtonArea>
    );
};

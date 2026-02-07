import { Button } from "../Button";
import { Field } from "../../Field";
import { useEventListener } from "../../../useEventListener";
import { useDS } from "../../../useDashStore";
import { useTimeout } from "../../../useTimeout";

const ButtonSubmitField = (p) => <Field Component={C} fieldType="button" {...p} />;
export default ButtonSubmitField;

// This can not be used as a seperate component. It needs Field.
const C = (props = {}) => {
    const {
        _formApi: { onSubmit } = {},
        formState: { isDirty, isTouched, isValid } = {},
        fieldRef,
        fieldVersion,
        inputProps: { buttonVersion, hideTitle, ...rest } = {},
    } = props;
    const { innerLoading, set: setLocal } = useDS();
    const isDisabled = !isValid || !isDirty || !isTouched;
    const [startTimeout] = useTimeout({ refreshTime: 1000, loop: false });

    // Listen enter key for submit
    const listenEnterKey = (e) => {
        if (isDisabled || e?.key !== "Enter") return;
        onSubmit?.(e);
        setLocal({ innerLoading: true });
        startTimeout(() => setLocal({ innerLoading: false }));
    };
    useEventListener("keydown", listenEnterKey, { delay: 1000 });

    /* Return */
    return (
        <Button
            {...(!hideTitle && { label: "Submit" })}
            preIcon="check"
            primary
            disabled={isDisabled}
            fieldVersion={buttonVersion || fieldVersion}
            onClick={onSubmit}
            fieldRef={fieldRef}
            isLoading={innerLoading}
            {...rest}
        />
    );
};

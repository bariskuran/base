import { FieldContext } from "./FieldContext";
import { useContext } from "react";

export const ComponentAnt = () => {
    const {
        _fieldApi = {},
        _fieldApi: {
            Component,
            enableAbsoluteLabel,
            onBlurFromField,
            onChangeFromField,
            onClickFromField,
            onFocusFromField,
            onPressEnterFromField,
            onClearFromField,
            onHoverFromField,
            valueFromField,
        } = {},
        restInputProps,
    } = useContext(FieldContext);

    /**
     * Return
     * */
    if (!Component) return null;
    return (
        <Component
            fromField
            inputProps={restInputProps}
            enableAbsoluteLabel={enableAbsoluteLabel}
            //
            value={valueFromField}
            onBlur={onBlurFromField}
            onChange={onChangeFromField}
            onClick={onClickFromField}
            onFocus={onFocusFromField}
            onPressEnter={onPressEnterFromField}
            onClear={onClearFromField}
            onHover={onHoverFromField}
            //
            {..._fieldApi}
        />
    );
};

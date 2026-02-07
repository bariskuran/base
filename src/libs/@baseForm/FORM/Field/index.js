import { useContext, useEffect, useMemo, useRef } from "react";
import { FormContext } from "../Context";
import { _prepareFieldApi } from "../Context/_fieldApi";
import { generateRandomText } from "../../generateRandomText";
import { ComponentAnt } from "./ComponentAnt";
import { ComponentWithField } from "./ComponentWithField";
import { usePreviousValue } from "./_usePreviousValue";
import { useDC } from "../../useDashStore";
import { FieldContext } from "./FieldContext";
import { useEffectAfterMount } from "../../useEffectAfterMount";
import { Wrapper } from "./Wrapper";

export const Field = (fieldProps = {}) => {
    /* Refs */
    const fieldRef = useRef(null);
    const lastDeactiveValue = useRef(fieldProps.deactivate);
    const popoverId = useRef(generateRandomText(36, true, true));
    const _formApi = useContext(FormContext);
    const { storeFile, formName, justHeaderFields } = _formApi || {};

    /**
     * Generate _fieldApi
     * Dynamic props should be added here.
     */
    const [_fieldApi, restInputProps] = useMemo(
        () => _prepareFieldApi(fieldProps, _formApi, fieldRef, popoverId),
        [fieldProps],
    );
    const { hidden, headerField, deactivate, useAntDirectly } = _fieldApi || {};
    const [formState, fieldState, setStoreFile] = useDC(storeFile, (s) => [
        s?.[formName],
        s?.[formName]?.fields?.[_fieldApi.name],
        s.set,
    ]);

    /**
     * Manage Previous Value
     */
    const [updatePreviousValueFunctionFromField] = usePreviousValue({
        _fieldApi,
        _formApi,
        fieldState,
        setStoreFile,
        triggerHook: _fieldApi?.isFieldApiReady,
    });

    /**
     * Mount and Unmount Field on Mount and Unmount AND on deactivate or !deactivate
     */
    const mount = () => _formApi?._mountField?.(_fieldApi);
    const unmount = () => _formApi?._unmountField?.(_fieldApi);
    useEffect(() => {
        mount();
        return unmount;
    }, []);
    useEffectAfterMount(() => {
        if (lastDeactiveValue.current === deactivate) return;
        lastDeactiveValue.current = deactivate;
        !deactivate ? mount() : unmount();
    }, [fieldProps.deactivate]);

    /**
     * Return
     */
    if (hidden) return null;
    if (justHeaderFields && !headerField) return null;
    if (deactivate) return null;
    return (
        <FieldContext
            value={{
                _fieldApi,
                _formApi,
                restInputProps,
                updatePreviousValueFunctionFromField,
                fieldState,
                formState,
                setStoreFile,
            }}
        >
            <Wrapper>{useAntDirectly ? <ComponentAnt /> : <ComponentWithField />}</Wrapper>
        </FieldContext>
    );
};

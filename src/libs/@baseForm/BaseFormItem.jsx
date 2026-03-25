import { useContext, useMemo, createContext, useEffect } from "react";
import { useHelper } from "./tools/useHelper.js";
import { baseStore } from "../@baseStore";
import { byPath } from "../byPath";
import { getPath } from "./tools/getPath";
import { debouncedFunction } from "../debouncedFunction";
import { validateField } from "./tools/validateField";
import { inputComponents } from "./inputComponents";

export const GroupContext = createContext(false);

export const BaseFormItem = (itemProps = {}) => {
    const {
        parent,
        parents = [],
        parentHandleNewValue,
        parentOnFocus,
        parentOnBlur,
        parentOnKeyDown,
        parentOnKeyUp,
        parentOnPaste,
        parentOnMouseEnter,
        parentOnMouseLeave,
        parentOnDropdownStatusChange,
    } = useContext(GroupContext);
    const {
        storeFile,
        name,
        deactivate,
        children,
        onChange,
        deriveValue,
        validationRules,
        onFocus,
        onBlur,
        onKeyEnter,
        onKeyDown,
        onKeyUp,
        onPaste,
        inputComponentProps,
        onClear,
        onMouseEnter,
        onMouseLeave,
        onDropdownStatusChange,
        prefix,
        suffix,
    } = itemProps || {};
    const path = useMemo(() => getPath({ parents, name }), [parents, name]);
    const [fields, field, setField, mountItem, unmountItem, validateForm] = baseStore.use(
        storeFile,
        (s) => [
            s.fields,
            byPath.get(s, path),
            s.setField,
            s.mountItem,
            s.unmountItem,
            s.validateForm,
        ],
    );
    const { HelperComponent, helperProps } = useHelper({ storeFile, field, itemProps });
    const { value, isMainItem } = field || {};

    /**
     * -------------------------------------------------
     *
     * ITEM STORE
     *
     * -------------------------------------------------
     */
    const { isFocused, isBlured, setLocal } = baseStore.useLocal({});
    /**
     * -------------------------------------------------
     *
     * MOUNT - UNMOUNT
     *
     * -------------------------------------------------
     */
    useEffect(() => {
        if (!deactivate) mountItem({ itemProps, parents, validateForm });
        else unmountItem({ itemProps, parents, validateForm });
        return () => unmountItem({ itemProps, parents, validateForm });
    }, [deactivate]);

    /**
     * -------------------------------------------------
     *
     * onChange Handler
     *
     * -------------------------------------------------
     */

    const generateHandlerPack = (p = {}) => {
        const { newState, incomingValue } = p;
        const newField = newState ? byPath.get(newState, path) : field;

        const childrenValues = newField?.children
            ? Object.entries(newField?.children).reduce((acc, [childKey, childObj]) => {
                  acc[childKey] = childObj?.value;
                  return acc;
              }, {})
            : {};

        const childrenPreviousValues = newField?.children
            ? Object.entries(newField?.children).reduce((acc, [childKey, childObj]) => {
                  acc[childKey] = childObj?.previousValue;
                  return acc;
              }, {})
            : {};

        const obj = {
            name,
            field: newField,
            fields,
            setField,
            path,
            previousValue: value,
            value: incomingValue ?? value,
            isMainItem,
            parent,
            childrenValues,
            childrenPreviousValues,
            validationRules,
        };
        return obj;
    };

    const handleNewValue = (incomingValue, newState) => {
        const cleanValue = inputComponents[inputComponentProps?.name]?.defaultValue;
        if (incomingValue === cleanValue && onClear) {
            onClear?.({ ...generateHandlerPack() });
        }
        const pack = generateHandlerPack({ newState, incomingValue });
        if (deriveValue) {
            pack.value = deriveValue?.(pack);
            pack.previousValue =
                deriveValue?.({ ...pack, value, childrenValues: pack.childrenPreviousValues }) ||
                value;
        }

        pack.childrenValues = { ...pack.childrenValues, [name]: pack.value };

        // if (name === "fullName")  console.log(">>>", path, fieldPath);

        const newState2 = storeFile.set((s) => {
            if (value === incomingValue) return;

            byPath.set(s, `${path}.value`, pack.value, true);
            byPath.set(s, `${path}.previousValue`, pack.previousValue, true);

            if (field.isMainItem) {
                s.values[name] = pack.value;
            }
        });

        if (parent?.name && parentHandleNewValue) {
            if (field?.value === undefined) {
                throw new Error(
                    `deriveValue for group "${name}" returned undefined. Did you forget return?`,
                );
            }
            parentHandleNewValue(undefined, newState2);
        }

        if (onChange) onChange(pack);

        const debunced = debouncedFunction(
            () => {
                console.log("validate ", name);
                // const result = storeFile.set((s) => {
                //     const [errors, isDirty, isValid, isTouched] = validateField({
                //         value: pack.value,
                //         validationRules,
                //         field: pack.field,
                //     });

                //     byPath.set(s, `${fieldPath}.errors`, errors, true);
                //     byPath.set(s, `${fieldPath}.isDirty`, isDirty, true);
                //     byPath.set(s, `${fieldPath}.isValid`, isValid, true);
                //     byPath.set(s, `${fieldPath}.isTouched`, isTouched, true);

                //     if (isMainItem) {
                //         s.values ??= {};
                //         s.values[name] = pack.value;
                //     }
                // });

                // pack.field = byPath.get(result, fieldPath);
                // onChange?.(pack);

                // if (parent?.name && parentHandleNewValue) {
                //     parentHandleNewValue(undefined, result);
                // }
            },
            { isThrottle: false, delay: 500, functionName: `debunced-${name}` },
        );
        debunced();
    };

    /**
     * -------------------------------------------------
     *
     * HANDLERS
onClear
onMouseEnter
onMouseLeave
onDropdownStatusChange
     *
     * -------------------------------------------------
     */
    const handleOnFocus = (e) => {
        onFocus?.({ ...generateHandlerPack(), event: e });
        parentOnFocus?.(e);
        setLocal((s) => {
            s.isFocused = true;
            s.isBlured = false;
        });
    };
    const handleOnBlur = (e) => {
        onBlur?.({ ...generateHandlerPack(), event: e });
        parentOnBlur?.(e);
        setLocal((s) => {
            s.isFocused = false;
            s.isBlured = true;
        });
    };
    const handleOnKeyDown = (e) => {
        parentOnKeyDown?.(e);
        if (e.key === "Enter") {
            onKeyEnter?.({ ...generateHandlerPack(), event: e });
        } else {
            onKeyDown?.({ ...generateHandlerPack(), event: e });
        }
    };
    const handleOnKeyUp = (e) => {
        onKeyUp?.({ ...generateHandlerPack(), event: e });
        parentOnKeyUp?.(e);
    };
    const handleOnPaste = (e) => {
        onPaste?.({ ...generateHandlerPack(), event: e });
        parentOnPaste?.(e);
    };
    const handleOnMouseEnter = (e) => {
        onMouseEnter?.({ ...generateHandlerPack(), event: e });
        parentOnMouseEnter?.(e);
    };
    const handleOnMouseLeave = (e) => {
        onMouseLeave?.({ ...generateHandlerPack(), event: e });
        parentOnMouseLeave?.(e);
    };
    const handleOnDropdownStatusChange = () => {
        onDropdownStatusChange?.({ ...generateHandlerPack() });
        parentOnDropdownStatusChange?.();
    };

    /**
     * -------------------------------------------------
     *
     * DEFINE COMPONENT
     *
     * -------------------------------------------------
     */
    const ComponentStructure = inputComponentProps?.Component && (
        <inputComponentProps.Component
            {...{
                value,
                onChange: handleNewValue,
                onFocus: handleOnFocus,
                onBlur: handleOnBlur,
                onKeyDown: handleOnKeyDown,
                onKeyUp: handleOnKeyUp,
                onPaste: handleOnPaste,
                prefix,
                suffix,

                ...(inputComponentProps?.name === "dropdown"
                    ? { onDropdownStatusChange: handleOnDropdownStatusChange }
                    : {}),
            }}
        />
    );

    /**
     * -------------------------------------------------
     *
     * RETURN
     *
     * -------------------------------------------------
     */
    return (
        <GroupContext.Provider
            value={{
                parent: field,
                parents: [...parents, name],
                parentHandleNewValue: handleNewValue,
                parentOnFocus: handleOnFocus,
                parentOnBlur: handleOnBlur,
                parentOnKeyDown: handleOnKeyDown,
                parentOnKeyUp: handleOnKeyUp,
                parentOnPaste: handleOnPaste,
                parentOnMouseEnter: handleOnMouseEnter,
                parentOnMouseLeave: handleOnMouseLeave,
                parentOnDropdownStatusChange: handleOnDropdownStatusChange,
            }}
        >
            <div>
                <HelperComponent
                    {...{
                        ...helperProps,
                        isFocused,
                        isBlured,
                        handleOnMouseEnter,
                        handleOnMouseLeave,
                    }}
                >
                    {inputComponentProps?.Component
                        ? ComponentStructure
                        : children
                          ? children
                          : "Missing Component or children"}
                </HelperComponent>
            </div>
        </GroupContext.Provider>
    );
};

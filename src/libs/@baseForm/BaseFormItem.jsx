import { useContext, useMemo, createContext, useEffect } from "react";
import { useHelper } from "./tools/useHelper";
import { baseStore } from "../@baseStore";
import { inputComponents } from "./inputComponents";
import { typeOf } from "../typeOf";
import { byPath } from "../byPath";
import { getPath } from "./tools/getPath";

export const GroupContext = createContext(false);

export const BaseFormItem = ({ storeFile, ...itemProps }) => {
    const {
        parent,
        parents = [],
        parentDeriveValue,
        parentHandleNewValue,
    } = useContext(GroupContext);

    const { name, deactivate, Component, children, onChange, deriveValue, validationRules } =
        itemProps || {};

    const path = useMemo(() => getPath({ parents, name }), [parents, name]);

    const { Helper, helperProps } = useHelper({ storeFile, name, parents, itemProps });
    const [fields, field, setField, mountItem, unmountItem] = baseStore.use(storeFile, (s) => [
        s.fields,
        byPath.get(s, path),
        s.setField,
        s.mountItem,
        s.unmountItem,
    ]);
    const { value, isMainItem } = field || {};

    /**
     * -------------------------------------------------
     *
     * MOUNT - UNMOUNT
     *
     * -------------------------------------------------
     */
    useEffect(() => {
        if (!deactivate) mountItem({ itemProps, parents });
        else unmountItem({ itemProps, parents });
        return () => unmountItem({ itemProps, parents });
    }, [deactivate]);

    /**
     * -------------------------------------------------
     *
     * onChange Handler
     *
     * -------------------------------------------------
     */
    const handleNewValue = (value, newState) => {
        const childrenValues = parent?.children
            ? Object.entries(parent?.children).reduce((acc, [childKey, childObj]) => {
                  acc[childKey] = childObj?.value;
                  return acc;
              }, {})
            : {};

        const pack = {
            name,
            value,
            field: newState ? byPath.get(newState, path) : field,
            fields,
            setField,
            path,
            changes: { value },
            isMainItem,
            parent,
            childrenValues: { ...childrenValues, [name]: value },
            validationRules,
        };
        const result = setField(pack);
        onChange?.(pack);

        if (parent?.name && parentHandleNewValue && parentDeriveValue) {
            const parentValue = parentDeriveValue(pack);
            if (parentValue === undefined) {
                throw new Error(
                    `deriveValue for group "${parent.name}" returned undefined. Did you forget return?`,
                );
            }
            parentHandleNewValue(parentValue, result);
        } else if (parent?.name) {
            if (typeof parentDeriveValue !== "function") {
                throw new Error(
                    `BaseFormGroup "${parent?.name}" must provide a "deriveValue" function.`,
                );
            }
        }
    };

    /**
     * -------------------------------------------------
     *
     * DEFINE COMPONENT
     *
     * -------------------------------------------------
     */
    const Com = typeOf(Component) === "string" ? inputComponents[Component] : Component;
    const ComponentStructure = <Com value={value} onChange={handleNewValue} />;

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
                parents: [...parents, name],
                parent: field,
                parentDeriveValue: deriveValue,
                parentHandleNewValue: handleNewValue,
            }}
        >
            <Helper {...helperProps}>
                {Component
                    ? ComponentStructure
                    : children
                      ? children
                      : "Missing Component or children"}
            </Helper>
        </GroupContext.Provider>
    );
};

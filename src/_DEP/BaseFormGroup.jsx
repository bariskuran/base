import { createContext } from "react";
import { baseStore } from "../baseStore";
import { useHelper } from "./tools/useHelper";
export const GroupContext = createContext(false);

export const BaseFormGroup = ({ storeFile, children, name }) => {
    // const {
    //     field,
    //     disableHelper: disableHelperGlobal = false,
    //     helperProps: helperPropsGlobal,
    //     set,
    // } = baseStore.use(storeFile, (s) => [s.fields[name], s.disableHelper, s.helperProps]);
    const { Helper, helperProps } = useHelper({ storeFile, name });

    const onGroupChange = (name, value) => {
        console.log("onGroupChange", name, value);
    };

    /* RETURN  */
    return (
        <GroupContext.Provider value={{ isGroupFields: true, onGroupChange }}>
            <Helper {...helperProps}>{children}</Helper>
        </GroupContext.Provider>
    );
};

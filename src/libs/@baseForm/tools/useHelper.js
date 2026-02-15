import { useMemo } from "react";
import { baseStore } from "../../@baseStore";
import { DefaultHelper } from "../DefaultHelper";

const Passthrough = ({ children }) => children ?? null;

export const useHelper = ({
    storeFile,
    name,
    parents = [],
    // itemProps
}) => {
    const [field, disableHelperGlobal = false, helperPropsGlobal = {}] = baseStore.use(
        storeFile,
        (s) => [s.fields?.[name], s.disableHelper, s.helperProps],
    );

    return useMemo(() => {
        const disableHelper = field?.disableHelper ?? disableHelperGlobal;
        const mergedProps = { ...helperPropsGlobal, ...(field?.helperProps || {}) };

        const HelperComponent = mergedProps.HelperComponent || DefaultHelper;
        const { HelperComponent: _omit, ...rest } = mergedProps;

        return {
            Helper: disableHelper || parents.length > 0 ? Passthrough : HelperComponent,
            helperProps: {
                storeFile,
                name,
                ...rest,
            },
        };
    }, [field, disableHelperGlobal, helperPropsGlobal, storeFile, name]);
};

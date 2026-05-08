import { createContext, useContext } from "react";

const NestedBaseUiContext = createContext(null);
const getNestedBaseUiContextValue = (extra = {}) => ({
    ...extra,
    __hasParentUiComponent: true,
});

export const useNestedBaseUiContext = () => useContext(NestedBaseUiContext) || {};

const NestedBaseUi = ({ children, value }) => {
    const base = getNestedBaseUiContextValue(value);
    return <NestedBaseUiContext.Provider value={base}>{children}</NestedBaseUiContext.Provider>;
};

export default NestedBaseUi;

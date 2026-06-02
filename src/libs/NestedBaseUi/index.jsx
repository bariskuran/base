import { createContext, useContext } from "react";

const NestedBaseUiContext = createContext(null);

export const NESTED_UI_TYPO_PHRASING_HOST = "__typoPhrasingHost";

const getNestedBaseUiContextValue = (parent = {}, extra = {}) => ({
    ...parent,
    ...extra,
    __hasParentUiComponent: true,
});

export const useNestedBaseUiContext = () => useContext(NestedBaseUiContext) || {};

const NestedBaseUi = ({ children, value }) => {
    const parent = useNestedBaseUiContext();
    const base = getNestedBaseUiContextValue(parent, value || {});
    return <NestedBaseUiContext.Provider value={base}>{children}</NestedBaseUiContext.Provider>;
};

export default NestedBaseUi;

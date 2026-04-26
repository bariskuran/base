import { createContext } from "react";
import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";
import ContextProvider from "../../ContextProviderForUiComponents";

const Context = createContext(null);

export const Base = ({ children, ...p }) => {
    const { Variant, flexProps, scrollBarProps, containerRef, borderColor, shouldRender } =
        useVars(p);

    if (!shouldRender) return null;

    return (
        <ContextProvider Context={Context}>
            <Variant ref={containerRef} {...flexProps} $borderColor={borderColor}>
                <ScrollBar {...scrollBarProps} />
                {children}
            </Variant>
        </ContextProvider>
    );
};

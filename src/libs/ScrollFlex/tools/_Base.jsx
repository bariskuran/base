import { createContext } from "react";
import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";
import ContextProvider from "../../ContextProviderForUiComponents";

const Context = createContext(null);

export const Base = ({ children, ...p }) => {
    const { Variant, flexProps, scrollBarProps, containerRef, borderColor } = useVars(p);

    return (
        <ContextProvider Context={Context}>
            <Variant ref={containerRef} {...flexProps} $borderColor={borderColor}>
                <ScrollBar {...scrollBarProps} />
                {children}
            </Variant>
        </ContextProvider>
    );
};

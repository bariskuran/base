import { createContext } from "react";
import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";
import ContextProvider from "../../ContextProviderForUiComponents";
import { S } from "./_styled.js";

const Context = createContext(null);

export const Base = ({ children, ...p }) => {
    const {
        Variant,
        flexProps,
        scrollBarProps,
        containerRef,
        borderColor,
        shouldRender,
        shellGutters,
        contentPaddingStyle,
    } = useVars(p);

    if (!shouldRender) return null;

    const { gutterTop, gutterRight, gutterBottom, gutterLeft } = shellGutters;

    return (
        <ContextProvider Context={Context}>
            <Variant ref={containerRef} {...flexProps} $borderColor={borderColor}>
                <S.shell
                    $gutterTop={gutterTop}
                    $gutterRight={gutterRight}
                    $gutterBottom={gutterBottom}
                    $gutterLeft={gutterLeft}
                >
                    <S.content style={contentPaddingStyle}>{children}</S.content>
                    <ScrollBar {...scrollBarProps} />
                </S.shell>
            </Variant>
        </ContextProvider>
    );
};

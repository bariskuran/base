import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";
import NestedBaseUi from "../../NestedBaseUi";
import { S } from "./_styled.js";

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
        <NestedBaseUi>
            <Variant ref={containerRef} $borderColor={borderColor} aria-label="ScrollFlex">
                <S.shell
                    $gutterTop={gutterTop}
                    $gutterRight={gutterRight}
                    $gutterBottom={gutterBottom}
                    $gutterLeft={gutterLeft}
                >
                    <S.content
                        aria-label="ScrollFlex content"
                        {...flexProps}
                        style={{
                            ...contentPaddingStyle,
                            ...(flexProps?.style || {}),
                        }}
                    >
                        {children}
                    </S.content>
                    <ScrollBar {...scrollBarProps} />
                </S.shell>
            </Variant>
        </NestedBaseUi>
    );
};

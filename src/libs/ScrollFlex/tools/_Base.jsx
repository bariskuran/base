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
        shellRef,
        shellSurfaceStyle,
        shellPointerHandlers,
        borderColor,
        shouldRender,
        shellGutters,
        contentPaddingStyle,
        variantOuterStyle,
    } = useVars(p);

    if (!shouldRender) return null;

    const { gutterTop, gutterRight, gutterBottom, gutterLeft } = shellGutters;

    return (
        <NestedBaseUi>
            <Variant
                ref={containerRef}
                $borderColor={borderColor}
                aria-label="ScrollFlex container"
                style={variantOuterStyle}
            >
                <S.shell
                    ref={shellRef}
                    {...shellPointerHandlers}
                    style={shellSurfaceStyle}
                    $gutterTop={gutterTop}
                    $gutterRight={gutterRight}
                    $gutterBottom={gutterBottom}
                    $gutterLeft={gutterLeft}
                    aria-label="ScrollFlex shell"
                >
                    <S.content
                        aria-label="ScrollFlex content"
                        {...flexProps}
                        style={{
                            ...contentPaddingStyle,
                            ...(flexProps?.style || {}),
                            minWidth: 0,
                            maxWidth: "100%",
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

import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";
import NestedBaseUi from "../../NestedBaseUi";
import { S } from "./_styled.js";

export const Base = ({ children, ...p }) => {
    const {
        Variant,
        flexProps,
        shellPaddingStyle,
        scrollBarProps,
        containerRef,
        shellRef,
        contentRef,
        shellSurfaceStyle,
        shellPointerHandlers,
        borderColor,
        shouldRender,
        shellLayoutStyle,
        shellViewportStyle,
        containerGridStyle,
        contentLayoutStyle,
        variantOuterStyle,
    } = useVars(p);

    if (!shouldRender) return null;

    return (
        <NestedBaseUi>
            <Variant
                ref={containerRef}
                $borderColor={borderColor}
                aria-label="ScrollFlex container"
                style={{
                    ...variantOuterStyle,
                    ...containerGridStyle,
                    display: "grid",
                }}
            >
                <S.shell
                    ref={shellRef}
                    style={{
                        ...shellViewportStyle,
                        ...shellPaddingStyle,
                        ...shellLayoutStyle,
                    }}
                    aria-label="ScrollFlex shell"
                >
                    <S.content
                        ref={contentRef}
                        aria-label="ScrollFlex content"
                        {...flexProps}
                        {...shellPointerHandlers}
                        style={{
                            ...(flexProps?.style || {}),
                            ...(contentLayoutStyle || {}),
                            ...(shellSurfaceStyle || {}),
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

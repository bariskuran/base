import { createContext } from "react";
import useVars from "./useVars";
import { ScrollBar } from "../../ScrollBar";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import ContextProvider from "../../ContextProviderForUiComponents";

const Context = createContext(null);

export const Base = ({ children, ...p }) => {
    const {
        maxHeight,
        maxWidth,
        Variant,
        containerRef,
        disableShadow,
        isOverflowingY,
        isOverflowingX,
        isOverflowing,
        fullWidth,
        scrollBarProps,
        disableScrollBox,
    } = useVars(p);

    if (disableScrollBox) {
        return children;
    }

    return (
        <ContextProvider Context={Context}>
            <div
                style={{
                    width: "unset",
                    maxWidth: "100%",
                    minWidth: 0,
                    position: "relative",
                }}
            >
                <Variant
                    ref={containerRef}
                    //
                    $maxHeight={cssNormalizeSize(maxHeight)}
                    $fullWidth={fullWidth}
                    $disableShadow={!isOverflowing ? false : disableShadow}
                    $isOverflowing={isOverflowing}
                    $isOverflowingY={isOverflowingY}
                    $isOverflowingX={isOverflowingX}
                    //
                    style={{
                        overscrollBehaviorY: isOverflowing ? "contain" : "auto",
                        overscrollBehaviorX: isOverflowing ? "contain" : "auto",
                        minWidth: 0,
                        ...(maxWidth ? { maxWidth: cssNormalizeSize(maxWidth) } : {}),
                        ...(maxHeight ? { maxHeight: cssNormalizeSize(maxHeight) } : {}),
                        ...(isOverflowingY && !fullWidth ? { paddingRight: 20 } : {}),
                        ...(isOverflowingX && !fullWidth ? { paddingBottom: 20 } : {}),
                        ...(fullWidth ? { width: "100%" } : { width: "max-content" }),
                    }}
                >
                    {children}
                </Variant>
                {isOverflowingY && <ScrollBar {...scrollBarProps} containerRef={containerRef} />}
                {isOverflowingX && (
                    <ScrollBar
                        {...scrollBarProps}
                        containerRef={containerRef}
                        scrollDirection="scrollX"
                        barPosition="horizontal"
                    />
                )}
            </div>
        </ContextProvider>
    );
};

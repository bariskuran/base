import { createPortal } from "react-dom";
import S from "./_styled.js";
import useVars from "./tools/useVars.js";

export const FloatingUi = ({ children, content, ...p }) => {
    const {
        open,
        openFromUser,
        childrenRef,
        floatingRef,
        bgColor,
        isMounted,
        positionX,
        positionY,
        alignX,
        alignY,
        blockVisibility,
        disableArrow,
        primary,
        secondary,
        onMouseEnter,
        onMouseLeave,
        onClick,
        Variant,
        colors,
        status,
        delayMs,
    } = useVars(p);

    /* RETURN */
    return (
        <>
            <S.children
                ref={childrenRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onPointerEnter={onMouseEnter}
                onPointerLeave={onMouseLeave}
                onClick={onClick}
            >
                {children}
            </S.children>
            {status !== "closed" && isMounted
                ? createPortal(
                      <Variant
                          ref={floatingRef}
                          $bgColor={bgColor}
                          aria-label="floating-ui"
                          $positionX={positionX}
                          $positionY={positionY}
                          $alignX={alignX}
                          $alignY={alignY}
                          $blockVisibility={blockVisibility}
                          $disableArrow={disableArrow}
                          $primary={primary}
                          $secondary={secondary}
                          $openFromUser={openFromUser}
                          $colors={colors || {}}
                          $status={status}
                          $delayMs={delayMs}
                      >
                          {content}
                      </Variant>,
                      document.body,
                  )
                : null}
        </>
    );
};

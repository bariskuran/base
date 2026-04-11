import styled from "styled-components";
import { createPortal } from "react-dom";
import useVars from "./useVars.js";
import ContextProvider from "../../ContextProviderForUiComponents";

const S = {
    children: styled.div`
        all: unset;
    `,
};

export const Base = ({ children, content, ...p }) => {
    const {
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
                      <ContextProvider>
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
                          </Variant>
                      </ContextProvider>,
                      document.body,
                  )
                : null}
        </>
    );
};

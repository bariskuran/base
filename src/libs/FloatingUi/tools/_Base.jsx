import styled from "styled-components";
import { createPortal } from "react-dom";
import useVars from "./useVars.js";
import NestedBaseUi from "../../NestedBaseUi";

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
        color,
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
        floatingMountHost,
        floatingPadding,
    } = useVars(p);

    /* Return */
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
            {status !== "closed" && isMounted && floatingMountHost
                ? createPortal(
                      <NestedBaseUi>
                          <Variant
                              ref={floatingRef}
                              $bgColor={bgColor}
                              $color={color}
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
                              $floatingPadding={floatingPadding}
                          >
                              {content}
                          </Variant>
                      </NestedBaseUi>,
                      floatingMountHost,
                  )
                : null}
        </>
    );
};

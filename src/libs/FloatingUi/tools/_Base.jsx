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
        onMouseEnter,
        onMouseLeave,
        onClick,
        Variant,
        colors,
        status,
        delayMs,
        floatingMountHost,
        floatingPadding,
        popoverTriggerMarker,
    } = useVars(p);

    /* Return */
    return (
        <>
            <S.children
                ref={childrenRef}
                {...(popoverTriggerMarker ? { "data-floating-ui-popover-trigger": "" } : {})}
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
                              $openFromUser={openFromUser}
                              $colors={colors || {}}
                              $status={status}
                              $delayMs={delayMs}
                              $floatingPadding={floatingPadding}
                              onMouseEnter={onMouseEnter}
                              onMouseLeave={onMouseLeave}
                              onClick={onClick}
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

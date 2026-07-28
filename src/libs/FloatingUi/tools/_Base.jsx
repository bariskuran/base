import styled from "styled-components";
import { createPortal } from "react-dom";
import useVars from "./useVars.js";
import NestedBaseUi from "helpers/NestedBaseUi";

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
        arrowOffset,
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
        floatingMaxWidth,
        popOverTriggerMarker,
    } = useVars(p);

    const trigger = (
        <S.children
            key="floating-ui-trigger"
            ref={childrenRef}
            {...(popOverTriggerMarker ? { "data-floating-ui-pop-over-trigger": "" } : {})}
        >
            {children}
        </S.children>
    );

    const portal =
        status !== "closed" && isMounted && floatingMountHost
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
                          $arrowOffset={arrowOffset}
                          $blockVisibility={blockVisibility}
                          $disableArrow={disableArrow}
                          $openFromUser={openFromUser}
                          $colors={colors || {}}
                          $status={status}
                          $delayMs={delayMs}
                          $floatingPadding={floatingPadding}
                          $maxWidth={floatingMaxWidth}
                          onMouseEnter={onMouseEnter}
                          onMouseLeave={onMouseLeave}
                          onClick={onClick}
                      >
                          {content}
                      </Variant>
                  </NestedBaseUi>,
                  floatingMountHost,
              )
            : null;

    // Fragment (not a returned array) — avoids missing-key warnings when portal mounts.
    return (
        <>
            {trigger}
            {portal}
        </>
    );
};

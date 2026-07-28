import { useEffect, useMemo, useRef } from "react";
import { useObserver } from "../../useObserver";
import S from "./_styled";

const observerThresholds = Array.from({ length: 21 }, (_, index) => index / 20);

/** Expand the hit-box so fade-in starts before the edge and fade-out waits until past it. */
const DEFAULT_VIEWPORT_MARGIN = "25% 0px 25% 0px";

const Amedist = ({
    animationMs = 800,
    distance = 240,
    viewportMargin = DEFAULT_VIEWPORT_MARGIN,
    onEnter,
    onExit,
    className,
    children,
    ...rest
}) => {
    const { ref, phase, direction, intersectionRatio, inViewport } = useObserver({
        threshold: observerThresholds,
        rootMargin: viewportMargin,
    });
    const previousPhaseRef = useRef("outside");
    const callbackMeta = useMemo(
        () => ({ phase, direction, intersectionRatio, inViewport }),
        [phase, direction, intersectionRatio, inViewport],
    );

    useEffect(() => {
        const previousPhase = previousPhaseRef.current;
        const isEntering = phase === "entering" || phase === "inside";
        const wasOutside = previousPhase === "outside" || previousPhase === "exiting";
        const isLeaving = phase === "exiting" || phase === "outside";
        const wasVisible = previousPhase === "entering" || previousPhase === "inside";

        if (isEntering && wasOutside) onEnter?.(callbackMeta);
        if (isLeaving && wasVisible) onExit?.(callbackMeta);

        previousPhaseRef.current = phase;
    }, [callbackMeta, onEnter, onExit, phase]);

    // Stay visible for the whole intersection (including "exiting").
    // Using only entering/inside made opacity drop while most of the item was still on screen.
    const visible = inViewport;

    return (
        <S.container
            {...rest}
            ref={ref}
            className={className}
            $visible={visible}
            $direction={direction}
            $distance={distance}
            $animationMs={animationMs}
            data-scroll-phase={phase}
            data-scroll-direction={direction}
            data-scroll-in-viewport={inViewport ? "" : undefined}
        >
            {children}
        </S.container>
    );
};

export default Amedist;

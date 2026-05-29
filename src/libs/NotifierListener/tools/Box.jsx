import { memo, useMemo, useRef, useLayoutEffect, useState, useCallback, useEffect } from "react";
import S from "./_styled";
import { TimeBar } from "./TimeBar";
import { Button } from "../../Button";
import { colorGet } from "../../colorGet";

export const Box = memo(function Box({ item, BoxComponent, theme, openingMs, onExitComplete }) {
    const {
        bgColor,
        value,
        disableAutoKill,
        remove,
        killAfter,
        status,
        closingDelay,
        shownAt,
        queueId,
    } = item || {};

    const colors = useMemo(() => colorGet(bgColor || theme?.background), [bgColor, theme]);
    const isClosing = status === "closing";
    const closingDelayMs = Number(closingDelay) || 500;
    const showTimeBar = !disableAutoKill;
    const showClose = disableAutoKill;

    const collapseRef = useRef(null);
    const slotRef = useRef(null);
    const [entered, setEntered] = useState(false);

    const handleEnterEnd = useCallback(
        (e) => {
            if (entered || e.target !== e.currentTarget) return;
            setEntered(true);
        },
        [entered],
    );

    useEffect(() => {
        if (entered) return;
        const timer = setTimeout(() => setEntered(true), openingMs + 50);
        return () => clearTimeout(timer);
    }, [entered, openingMs]);

    useLayoutEffect(() => {
        if (!isClosing) return;

        const el = collapseRef.current;
        const slotEl = slotRef.current;
        if (!el) return;

        const height = el.scrollHeight;

        el.style.overflow = "hidden";
        el.style.height = `${height}px`;
        el.style.opacity = "1";
        el.style.transition = "none";

        if (slotEl) {
            slotEl.style.transition = "none";
            slotEl.style.marginBottom = `${10}rem`;
        }

        void el.offsetHeight;

        el.style.transition = `height ${closingDelayMs}ms ease, opacity ${closingDelayMs}ms ease`;
        el.style.height = "0px";
        el.style.opacity = "0";

        if (slotEl) {
            slotEl.style.transition = `margin-bottom ${closingDelayMs}ms ease`;
            slotEl.style.marginBottom = "0px";
        }

        const onEnd = (e) => {
            if (e.target !== el || e.propertyName !== "height") return;
            onExitComplete?.(queueId);
        };

        el.addEventListener("transitionend", onEnd);
        return () => el.removeEventListener("transitionend", onEnd);
    }, [isClosing, closingDelayMs, queueId, onExitComplete]);

    return (
        <S.slot ref={slotRef}>
            <S.shell>
                <S.collapse ref={collapseRef}>
                    <S.slotInner
                        $openingMs={openingMs}
                        $entered={entered}
                        onAnimationEnd={handleEnterEnd}
                    >
                        <BoxComponent
                            $bgColor={colors?.color}
                            $colors={colors}
                            $closingDelay={closingDelayMs}
                            $killAfter={killAfter}
                            $disableAutoKill={disableAutoKill}
                            $isClosing={isClosing}
                            $status={status}
                        >
                            {showTimeBar && <TimeBar killAfterMs={killAfter} shownAt={shownAt} />}

                            {showClose && (
                                <div data-slot="close">
                                    <Button.closeIcon onClick={remove} color={colors?.opposite} />
                                </div>
                            )}

                            <div data-slot="content">{value}</div>
                        </BoxComponent>
                    </S.slotInner>
                </S.collapse>
            </S.shell>
        </S.slot>
    );
});

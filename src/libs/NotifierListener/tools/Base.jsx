import S from "./_styled";
import { memo, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { useVars } from "./useVars";
import { ScrollFlex } from "../../ScrollFlex";
import { Button } from "../../Button";
import { colorGet } from "../../colorGet";
import { baseStore } from "../../@baseStore";
import { DefaultVariant } from "../DefaultVariant";
import { PlainVariant } from "../PlainVariant";
import { TestVariant } from "../TestVariant";
import { Flex } from "../../Flex";

const NOTIFIER_SHELLS = {
    default: DefaultVariant,
    plain: PlainVariant,
    test: TestVariant,
};

const normalizeVariantKey = (value) => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value != null && typeof value === "object" && typeof value.variant === "string") {
        return value.variant.trim();
    }
    return null;
};

const pickNotifierShell = (...candidates) => {
    for (const candidate of candidates) {
        const key = normalizeVariantKey(candidate);
        if (key && NOTIFIER_SHELLS[key]) return NOTIFIER_SHELLS[key];
    }
    return DefaultVariant;
};

const TIMEBAR_KEYFRAMES_ID = "notifier-timebar-keyframes";

const ensureTimeBarKeyframes = () => {
    if (typeof document === "undefined") return;
    if (document.getElementById(TIMEBAR_KEYFRAMES_ID)) return;

    const style = document.createElement("style");
    style.id = TIMEBAR_KEYFRAMES_ID;
    style.textContent = `
        @keyframes notifierTimeBarGrow {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
    `;
    document.head.appendChild(style);
};

const TimeBar = memo(
    function TimeBar({ killAfterMs, shownAt }) {
        const fillRef = useRef(null);

        useEffect(() => {
            ensureTimeBarKeyframes();
            const el = fillRef.current;
            if (!el || !killAfterMs) return;

            const elapsed = Math.max(0, Date.now() - (shownAt || Date.now()));
            const delaySec = Math.min(elapsed / 1000, killAfterMs / 1000);

            el.style.transformOrigin = "left center";
            el.style.transform = "scaleX(0)";
            el.style.animation = "none";
            void el.offsetWidth;
            el.style.animation = `notifierTimeBarGrow ${killAfterMs}ms linear forwards`;
            if (delaySec > 0) {
                el.style.animationDelay = `-${delaySec}s`;
            }
        }, [killAfterMs, shownAt]);

        return (
            <div data-slot="timeBar">
                <div ref={fillRef} data-slot="timeBarFill" />
            </div>
        );
    },
    (prev, next) => prev.killAfterMs === next.killAfterMs && prev.shownAt === next.shownAt,
);

const Box = memo(function Box({ item, layoutVariant, globalVariant, theme }) {
    const {
        bgColor,
        value,
        variant: itemVariant,
        disableAutoKill,
        remove,
        killAfter,
        status,
        closingDelay,
        shownAt,
    } = item || {};

    const colors = useMemo(() => colorGet(bgColor || theme?.background), [bgColor, theme]);
    const Shell = pickNotifierShell(itemVariant, layoutVariant, globalVariant);
    const containerRef = useRef(null);

    const { boxHeight, set } = baseStore.useLocal({ boxHeight: "" });
    const isClosing = status === "closing";
    const closingDelayMs = Number(closingDelay) || 500;

    useLayoutEffect(() => {
        if (!isClosing || !containerRef.current) return;

        const el = containerRef.current;
        const h = el.getBoundingClientRect().height;
        if (h <= 0) return;

        el.style.maxHeight = `${h}px`;
        set((s) => {
            s.boxHeight = `${h}px`;
        });
    }, [isClosing, set]);

    return (
        <Shell
            ref={containerRef}
            $bgColor={colors?.color}
            $colors={colors}
            $closingDelay={closingDelayMs}
            $killAfter={killAfter}
            $disableAutoKill={disableAutoKill}
            $isClosing={isClosing}
            $status={status}
            $boxHeight={boxHeight}
        >
            {!disableAutoKill && <TimeBar killAfterMs={killAfter} shownAt={shownAt} />}

            <div data-slot="close">
                <Button.closeIcon onClick={remove} color={colors?.opposite} />
            </div>

            <div data-slot="content">{value}</div>
        </Shell>
    );
});

export const Base = (p = {}) => {
    const { layoutVariant, isEmpty, queue = [], theme } = useVars(p);
    const [_notifier] = baseStore.useGlobal((s) => [s._notifier]);
    const globalVariant =
        typeof _notifier?.variant === "string" ? _notifier.variant : null;

    return (
        <S.container $isEmpty={isEmpty} aria-label="NotifierListener container">
            {!isEmpty && (
                <ScrollFlex.plain padding={10} full height="100%">
                    <Flex.column gap={10} full paddingBottom={10}>
                        {queue.map(
                            (item) =>
                                item.value && (
                                    <Box
                                        key={item.queueId}
                                        item={item}
                                        layoutVariant={layoutVariant}
                                        globalVariant={globalVariant}
                                        theme={theme}
                                    />
                                ),
                        )}
                    </Flex.column>
                </ScrollFlex.plain>
            )}
        </S.container>
    );
};

import S from "./_styled";
import { useMemo, useRef, useLayoutEffect } from "react";
import { useVars } from "./useVars";
import { ScrollFlex } from "../../ScrollFlex";
import { Button } from "../../Button";
import { colorGet } from "../../colorGet";
import { useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { Flex } from "../../Flex";

export const Base = (p = {}) => {
    const {
        Variant: VariantProp,
        isEmpty,
        queue = [],
        theme,
        containerRef,
        closingDelay,
    } = useVars(p);
    const [_notifier] = baseStore.useGlobal((s) => [s._notifier]);
    const { closingDelay: closingDelayGlobal } = _notifier || {};
    const Variant = _notifier?.variant || _notifier?.Variant || VariantProp;

    /* RETURN */
    return (
        <S.container
            $isEmpty={isEmpty}
            $closingDelay={(closingDelay || closingDelayGlobal) * 1000}
            aria-label="NotifierListener container"
        >
            {!isEmpty && (
                <ScrollFlex.plain padding={10} full height="100%">
                    <Flex.column full paddingBottom={10}>
                        {queue.map(
                            (item) =>
                                item.value && (
                                    <Box
                                        key={item.queueId}
                                        item={item}
                                        Variant={Variant}
                                        theme={theme}
                                        containerRef={containerRef}
                                    />
                                ),
                        )}
                    </Flex.column>
                </ScrollFlex.plain>
            )}
        </S.container>
    );
};

const Box = ({ item, Variant, theme }) => {
    const { bgColor, value, disableAutoKill, remove, killAfter, status, closingDelay } = item || {};

    const colors = useMemo(() => colorGet(bgColor || theme?.background), [bgColor, theme]);

    const shellRef = useRef(null);
    const contentRef = useRef(null);

    const { height, isEntered, setLocal } = baseStore.useLocal({
        height: 0,
        isEntered: false,
    });

    const isClosing = status === "closing";

    const delay = Number(closingDelay || 300);

    useLayoutEffect(() => {
        if (!contentRef.current) return;

        const el = contentRef.current;

        const updateHeight = () => {
            setLocal((s) => {
                s.height = el.scrollHeight;
            });
        };

        updateHeight();

        const ro = new ResizeObserver(updateHeight);
        ro.observe(el);

        return () => ro.disconnect();
    }, [value]);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setLocal((s) => {
                s.isEntered = true;
            });
        });

        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <S.itemShell
            ref={shellRef}
            $height={height}
            $isEntered={isEntered}
            $isClosing={isClosing}
            $closingDelay={delay}
        >
            <S.itemInner ref={contentRef}>
                <Variant
                    $bgColor={colors?.color}
                    $colors={colors}
                    $closingDelay={delay}
                    $killAfter={killAfter}
                    $disableAutoKill={disableAutoKill}
                    $isClosing={isClosing}
                    $status={status}
                    $boxHeight={`${height}px`}
                >
                    {!disableAutoKill && <div data-slot="timeBar" />}

                    <div data-slot="close">
                        <Button.closeIcon onClick={remove} color={colors?.opposite} />
                    </div>

                    <div data-slot="content">{value}</div>
                </Variant>
            </S.itemInner>
        </S.itemShell>
    );
};

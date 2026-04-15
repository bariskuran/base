import S from "./_styled";
import { useMemo } from "react";
import { useVars } from "./useVars";
import { Button } from "../../Button";
import { colorGet } from "../../colorGet";
import { useEffect } from "react";
import { baseStore } from "../../@baseStore";

export const Base = (p = {}) => {
    const { Variant, isEmpty, queue = [], theme, containerRef, closingDelay } = useVars(p);
    const [_notifier] = baseStore.useGlobal((s) => [s._notifier]);
    const { closingDelay: closingDelayGlobal } = _notifier || {};

    /* RETURN */
    return (
        <S.container $isEmpty={isEmpty} $closingDelay={(closingDelay || closingDelayGlobal) * 1000}>
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
        </S.container>
    );
};

const Box = ({ item, Variant, theme, containerRef }) => {
    const { bgColor, value, disableAutoKill, remove, killAfter, status, closingDelay } = item || {};

    const colors = useMemo(() => colorGet(bgColor || theme?.background), [bgColor, theme]);

    const { boxHeight, setLocal } = baseStore.useLocal({ boxHeight: 0 });

    const isClosing = status === "closing";

    useEffect(() => {
        if (!containerRef?.current) return;
        const el = containerRef.current;
        const h = el.getBoundingClientRect().height;
        el.style.maxHeight = `${h}px`;
        setLocal((s) => {
            s.boxHeight = h + "px";
        });
    }, [isClosing, containerRef?.current]);

    /* RETURN */
    return (
        <Variant
            ref={containerRef}
            $bgColor={colors?.color}
            $colors={colors}
            $closingDelay={closingDelay}
            $killAfter={killAfter}
            $disableAutoKill={disableAutoKill}
            $isClosing={isClosing}
            $status={status}
            $boxHeight={boxHeight}
        >
            {!disableAutoKill && <div data-slot="timeBar" />}
            <div data-slot="close">
                <Button.closeIcon onClick={remove} color={colors?.opposite} />
            </div>
            <div data-slot="content">{value}</div>
        </Variant>
    );
};

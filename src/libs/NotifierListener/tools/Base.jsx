import S from "./_styled";
import { useMemo } from "react";
import { useVars } from "./useVars";
import { ScrollFlex } from "../../ScrollFlex";
import { Button } from "../../Button";
import { colorGet } from "../../colorGet";
import { useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { DefaultVariant } from "../DefaultVariant";
import { PlainVariant } from "../PlainVariant";
import { TestVariant } from "../TestVariant";
import { Flex } from "../../Flex";

const NOTIFIER_VARIANTS = {
    default: DefaultVariant,
    plain: PlainVariant,
    test: TestVariant,
};

const resolveNotifierVariant = (variant, fallback) => {
    if (variant == null || variant === false) return fallback;
    if (typeof variant === "string") return NOTIFIER_VARIANTS[variant] || fallback;
    return variant;
};

export const Base = (p = {}) => {
    const {
        Variant,
        variant: notifierVariant,
        isEmpty,
        queue = [],
        theme,
        containerRef,
        closingDelay,
    } = useVars(p);
    const [_notifier] = baseStore.useGlobal((s) => [s._notifier]);
    const { closingDelay: closingDelayGlobal } = _notifier || {};

    /* RETURN */
    return (
        <S.container $isEmpty={isEmpty} $closingDelay={(closingDelay || closingDelayGlobal) * 1000}>
            {!isEmpty && (
                <ScrollFlex.plain paddingLeft={30} paddingRight={10} paddingTop={10}>
                    <Flex.column gap={10} full paddingBottom={10}>
                        {queue.map(
                            (item) =>
                                item.value && (
                                    <Box
                                        key={item.queueId}
                                        item={item}
                                        Variant={Variant}
                                        notifierVariant={notifierVariant}
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

const Box = ({ item, Variant, notifierVariant, theme, containerRef }) => {
    const { bgColor, value, variant, disableAutoKill, remove, killAfter, status, closingDelay } =
        item || {};

    const colors = useMemo(() => colorGet(bgColor || theme?.background), [bgColor, theme]);
    const ItemVariant = resolveNotifierVariant(variant ?? notifierVariant, Variant);

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
        <ItemVariant
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
        </ItemVariant>
    );
};

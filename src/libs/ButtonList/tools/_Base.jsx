import useVars from "./useVars";
import { Button } from "../../Button";
import { ScrollBar } from "../../ScrollBar";
import { Flex } from "../../Flex";

const assignRef = (ref, value) => {
    if (!ref) return;
    if (typeof ref === "function") {
        ref(value);
        return;
    }
    ref.current = value;
};

const mergeRefs =
    (...refs) =>
    (value) => {
        refs.forEach((ref) => assignRef(ref, value));
    };

export const Base = (p = {}) => {
    const {
        Variant,
        forwardedRef,
        resolvedFlexProps,
        mergedScrollBarProps,
        flexScrollRef,
        preparedItems,
    } = useVars(p);

    const { ref: userFlexRef, ...flexRest } = resolvedFlexProps;

    return (
        <Variant ref={forwardedRef}>
            <Flex ref={mergeRefs(userFlexRef, flexScrollRef)} {...flexRest}>
                {preparedItems.map((item, i) => (
                    <Button key={i} {...item} />
                ))}
            </Flex>
            <ScrollBar {...{ ...mergedScrollBarProps, edgeMargin: -50 }} />
        </Variant>
    );
};

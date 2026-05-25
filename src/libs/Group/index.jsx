import { createElement, useMemo } from "react";
import { Flex } from "../Flex";
import { deepMerge } from "../deepMerge";

/**
 * Renders a list of the same component type with shared groupProps merged into each item.
 * Item props override groupProps (deepMerge).
 */
export const Group = ({
    component: Component,
    items = [],
    groupProps = {},
    flexProps = {},
    flat = false,
}) => {
    const preparedItems = useMemo(
        () => items.map((item) => deepMerge(groupProps, item)),
        [groupProps, items],
    );

    if (!Component) return null;

    const nodes = preparedItems.map((item, index) => {
        const { key, ...itemProps } = item || {};

        return createElement(Component, {
            key: key ?? index,
            ...itemProps,
        });
    });

    if (flat) return <>{nodes}</>;

    return (
        <Flex {...flexProps}>
            {nodes}
        </Flex>
    );
};

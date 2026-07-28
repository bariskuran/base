import { cloneElement, createContext, Fragment, isValidElement, useContext } from "react";

const NestedBaseUiContext = createContext(null);

export const NESTED_UI_TYPO_PHRASING_HOST = "__typoPhrasingHost";

/** Works across yarn-link / dual-React copies (Fragment is Symbol.for). */
const REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");

const isFragmentElement = (node) => isValidElement(node) && node.type === REACT_FRAGMENT_TYPE;

const getNestedBaseUiContextValue = (parent = {}, extra = {}) => ({
    ...parent,
    ...extra,
    __hasParentUiComponent: true,
});

export const useNestedBaseUiContext = () => useContext(NestedBaseUiContext) || {};

/**
 * Flatten Fragments and ensure every list item has a key.
 * Re-parenting a Fragment whose children are an unkeyed element list makes React
 * attribute the missing-key warning to NestedBaseUi — even when that Fragment is
 * passed via `content` and wrapped in a span.
 */
const toKeyedHostChildren = (node, keyPrefix = "nested-ui") => {
    if (node == null || node === false || node === true) return [];

    if (isFragmentElement(node)) {
        return toKeyedHostChildren(node.props?.children, keyPrefix);
    }

    if (Array.isArray(node)) {
        const out = [];
        node.forEach((child, index) => {
            if (isFragmentElement(child)) {
                out.push(...toKeyedHostChildren(child.props?.children, `${keyPrefix}-${index}`));
                return;
            }

            if (isValidElement(child)) {
                out.push(cloneElement(child, { key: child.key ?? `${keyPrefix}-${index}` }));
                return;
            }

            if (child == null || child === false || child === true) return;

            out.push(
                <Fragment key={`${keyPrefix}-${index}`}>{child}</Fragment>,
            );
        });
        return out;
    }

    if (isValidElement(node)) return [node];

    return [<Fragment key={`${keyPrefix}-0`}>{node}</Fragment>];
};

/**
 * Provider always gets exactly one child (display:contents span).
 * Prefer `content` for list/Fragment payloads (Typo). `children` for single hosts
 * (ScrollFlex, FloatingUi).
 */
const NestedBaseUi = ({ children, content, value }) => {
    const parent = useNestedBaseUiContext();
    const base = getNestedBaseUiContextValue(parent, value || {});
    const node = content !== undefined ? content : children;
    const hostChildren = toKeyedHostChildren(node);

    return (
        <NestedBaseUiContext.Provider value={base}>
            <span style={{ display: "contents" }} data-nested-base-ui="">
                {hostChildren.length <= 1 ? hostChildren[0] ?? null : hostChildren}
            </span>
        </NestedBaseUiContext.Provider>
    );
};

export default NestedBaseUi;

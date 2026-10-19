/**
 * Icon library definition used by the Base Design System.
 *
 * Each icon entry is defined as a tuple with **three fixed positions**:
 *
 * `[0] viewBox` SVG viewBox value. **Consistency rule:** width **or** height MUST be max `20`
 * `[1] svgPath` SVG `<path d="...">` definition. No `<svg>` wrapper
 * `[2] searchKeywords` (optional) Keywords used **only for search / filtering** in development tools.
 * - Used by `localhost:3000/baseDesignSystem/icons` explorer
 *
 * ```js
 * import { Icon } from "base";
 * <Icon icon="arrowDown" width={16} />
 * ```
 *
 * ### `<Icon />` Props
 *
 * @param {string} icon - Icon name (key of ICONS_LIBRARY)
 * @param {number} [width=10] - Icon width (height auto-calculated unless `useHeight` is true)
 * @param {string} [color] - Icon color (defaults to theme foreground color)
 * @param {string} [onHoverColor] - Color applied on hover
 * @param {Object} [style] - Inline style object
 * @param {boolean} [useHeight=false] - Uses height instead of width for scaling
 */
export const ICONS_LIBRARY = {
    // example: [
    //     "20 20",
    //     "d",
    //     ["logo"],
    // ],
};

import { cssNormalizeSize } from "../cssNormalizeSize";

/**
 *
 * @example
 * cssSpacingResolver({ margin: "10px 20px" });
 * returns "10px 20px 10px 20px"
 *
 * cssSpacingResolver({ margin: "10px", marginLeft: "5px" });
 * returns "10px 10px 10px 5px"
 *
 * cssSpacingResolver({ padding: "4px 8px", paddingTop: "20px" }, "padding");
 * returns "20px 8px 4px 8px"
 */

const parseSpacing = (value) => {
    if (value == null) return {};

    if (typeof value === "number" || typeof value === "string") {
        const parts = String(value).trim().split(/\s+/);

        const [t, r = t, b = t, l = r] =
            parts.length === 1
                ? [parts[0], parts[0], parts[0], parts[0]]
                : parts.length === 2
                  ? [parts[0], parts[1], parts[0], parts[1]]
                  : parts.length === 3
                    ? [parts[0], parts[1], parts[2], parts[1]]
                    : parts.length >= 4
                      ? [parts[0], parts[1], parts[2], parts[3]]
                      : [];

        return {
            top: cssNormalizeSize(t),
            right: cssNormalizeSize(r),
            bottom: cssNormalizeSize(b),
            left: cssNormalizeSize(l),
        };
    }

    if (typeof value === "object") {
        return {
            top: cssNormalizeSize(value.top),
            right: cssNormalizeSize(value.right),
            bottom: cssNormalizeSize(value.bottom),
            left: cssNormalizeSize(value.left),
        };
    }

    return {};
};

export const cssSpacingResolver = (props = {}, key = "margin") => {
    const base = parseSpacing(props[key]);

    const top = cssNormalizeSize(props[`${key}Top`] ?? props[`${key}-top`] ?? base.top);
    const right = cssNormalizeSize(props[`${key}Right`] ?? props[`${key}-right`] ?? base.right);
    const bottom = cssNormalizeSize(props[`${key}Bottom`] ?? props[`${key}-bottom`] ?? base.bottom);
    const left = cssNormalizeSize(props[`${key}Left`] ?? props[`${key}-left`] ?? base.left);

    if ([top, right, bottom, left].every((v) => v == null)) return null;

    return `${top || 0} ${right || 0} ${bottom || 0} ${left || 0}`;
};

import { colorFind } from "../../colorFind";
import { isObject, isValidIconArray } from "./validators";

export const resolveThemeColor = (theme, value) => {
    if (!value) return value;
    if (typeof value !== "string") return value;
    return colorFind(value, { theme, output: "hex8" }) ?? value;
};

export const normalizeIconsLibrary = (value) => {
    if (!isObject(value)) return {};
    return value;
};

export const resolveIconInput = (iconInput, allIcons) => {
    if (!iconInput) return null;

    if (typeof iconInput === "string") {
        const fromLibrary = allIcons?.[iconInput];
        return isValidIconArray(fromLibrary) ? fromLibrary : null;
    }

    return isValidIconArray(iconInput) ? iconInput : null;
};

export const createIconMeta = (iconInput, allIcons) => {
    const file = resolveIconInput(iconInput, allIcons);
    if (!file) return null;

    const [viewBox, Content] = file;
    const [viewW, viewH] = viewBox.split(/\s+/).map(Number);

    if (!viewW || !viewH) return null;

    const ratio = viewW / viewH;
    const stretch = Math.max(ratio, 1 / ratio);
    const opticalScale = Math.max(0.84, Math.min(1, 1 / Math.pow(stretch, 0.18)));

    return {
        Content,
        viewW,
        viewH,
        opticalScale,
        centerX: viewW / 2,
        centerY: viewH / 2,
    };
};

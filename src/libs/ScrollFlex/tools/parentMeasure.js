const isUsableHeightValue = (value) => {
    if (!value) return false;

    const v = String(value).trim();

    if (v.includes("%")) return false;

    return !["auto", "initial", "inherit", "unset", "0", "0px"].includes(v);
};

const getRuleHeight = (node) => {
    if (typeof document === "undefined") return null;

    for (const sheet of Array.from(document.styleSheets || [])) {
        let rules;

        try {
            rules = sheet.cssRules;
        } catch {
            continue;
        }

        for (const rule of Array.from(rules || [])) {
            if (!rule.selectorText || !rule.style?.height) continue;

            try {
                if (node.matches(rule.selectorText)) return rule.style.height;
            } catch {
                continue;
            }
        }
    }

    return null;
};

const getAuthoredHeight = (node) => node?.style?.height || getRuleHeight(node);

const withNodeHidden = (node, fn) => {
    if (!node) return fn();

    const previousDisplay = node.style.display;
    node.style.display = "none";

    try {
        return fn();
    } finally {
        node.style.display = previousDisplay;
    }
};

export const getParentHeightWithoutSelf = (node) => {
    const parent = node?.parentElement;
    if (!node || !parent) return 0;

    return withNodeHidden(node, () => parent.getBoundingClientRect().height);
};

export const getParentWidthWithoutSelf = (node) => {
    const parent = node?.parentElement;
    if (!node || !parent) return 0;

    return withNodeHidden(node, () => parent.getBoundingClientRect().width);
};

export const getAncestorAuthoredHeightWithoutSelf = (node) => {
    if (!node || typeof document === "undefined") return 0;

    return withNodeHidden(node, () => {
        let current = node.parentElement;

        while (current && current !== document.body && current !== document.documentElement) {
            if (isUsableHeightValue(getAuthoredHeight(current))) {
                return current.getBoundingClientRect().height;
            }

            current = current.parentElement;
        }

        return 0;
    });
};

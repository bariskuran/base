
export const resolveFlexTypoWrap = (raw) => {
    if (raw == null || raw === "") return null;

    if (typeof raw === "string") {
        const variantKey = raw.trim();
        return variantKey ? { variantKey, typoProps: {} } : null;
    }

    if (typeof raw === "object") {
        const variantKey = String(raw.type ?? raw.variant ?? "").trim();
        if (!variantKey) return null;
        const typoProps = { ...raw };
        delete typoProps.type;
        delete typoProps.variant;
        return { variantKey, typoProps };
    }

    return null;
};

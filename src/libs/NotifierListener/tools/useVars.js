import { baseStore } from "../../@baseStore";

export const useVars = (p) => {
    const { variant: layoutVariant } = p || {};

    const [_notifier, theme] = baseStore.useGlobal((s) => [s._notifier, s.theme]);
    const { queue = [] } = _notifier || {};

    const isEmpty = (queue || []).length === 0;

    return {
        ..._notifier,
        layoutVariant: typeof layoutVariant === "string" ? layoutVariant : null,
        isEmpty,
        queue,
        theme,
    };
};

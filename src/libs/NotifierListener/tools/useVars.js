import { baseStore } from "../../@baseStore";
import { useRef } from "react";

export const useVars = (p) => {
    const { Variant } = p;

    const [_notifier, theme] = baseStore.useGlobal((s) => [s._notifier, s.theme]);
    const { queue = [] } = _notifier || {};
    const containerRef = useRef(null);

    const isEmpty = (queue || []).length === 0;

    return {
        Variant,
        ..._notifier,
        isEmpty,
        queue,
        theme,
        containerRef,
    };
};

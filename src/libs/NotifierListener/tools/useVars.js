import { useMemo } from "react";
import { baseStore } from "../../@baseStore";
import { DefaultVariant } from "../DefaultVariant";
import { useDisplayQueue } from "./useDisplayQueue";

export const OPENING_MS = 500;

export const useVars = () => {
    const [_notifier, theme, projectSettings] = baseStore.useGlobal((s) => [
        s._notifier,
        s.theme,
        s._projectSettings,
    ]);

    const { queue = [] } = _notifier || {};

    const visibleQueue = useMemo(
        () => (queue || []).filter((item) => item?.value),
        [queue],
    );

    const { displayQueue, onExitComplete } = useDisplayQueue(visibleQueue);

    const BoxComponent = projectSettings?.notifierSettings?.Box || DefaultVariant;

    return {
        displayQueue,
        onExitComplete,
        theme,
        BoxComponent,
        openingMs: OPENING_MS,
    };
};

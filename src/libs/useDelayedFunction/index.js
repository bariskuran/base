import { useCallback, useMemo, useRef } from "react";
import { baseStore } from "../@baseStore";
import { delayedFunction } from "../delayedFunction";

export const useDelayedFunction = (fn, settings = {}) => {
    const { delay = 500, autoCancel = true } = settings;
    const fnRef = useRef(fn);
    fnRef.current = fn;

    const { isPending, set } = baseStore.useLocal({ isPending: false });

    const stableSettings = useMemo(() => ({ delay, autoCancel }), [delay, autoCancel]);

    const delayed = useMemo(
        () =>
            delayedFunction(
                (...args) => {
                    fnRef.current?.(...args);
                    set((s) => {
                        s.isPending = false;
                    });
                },
                stableSettings,
            ),
        [stableSettings, set],
    );

    const run = useCallback(
        (...args) => {
            delayed.run(...args);
            set((s) => {
                s.isPending = true;
            });
        },
        [delayed, set],
    );

    const cancel = useCallback(() => {
        delayed.cancel();
        set((s) => {
            s.isPending = false;
        });
    }, [delayed, set]);

    const runNow = useCallback(
        (...args) => {
            delayed.runNow(...args);
            set((s) => {
                s.isPending = false;
            });
        },
        [delayed, set],
    );

    return {
        run,
        cancel,
        runNow,
        isPending,
    };
};

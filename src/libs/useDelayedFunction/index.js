import { useCallback, useMemo, useRef } from "react";
import { baseStore } from "../@baseStore";
import { delayedFunction } from "../delayedFunction";

export const useDelayedFunction = (fn, settings = {}) => {
    const { delay = 500, autoCancel = true } = settings;
    const fnRef = useRef(fn);
    fnRef.current = fn;

    const { isPending, setLocal } = baseStore.useLocal({ isPending: false });

    const stableSettings = useMemo(() => ({ delay, autoCancel }), [delay, autoCancel]);

    const delayed = useMemo(
        () =>
            delayedFunction(
                (...args) => {
                    fnRef.current?.(...args);
                    setLocal((s) => {
                        s.isPending = false;
                    });
                },
                stableSettings,
            ),
        [stableSettings, setLocal],
    );

    const run = useCallback(
        (...args) => {
            delayed.run(...args);
            setLocal((s) => {
                s.isPending = true;
            });
        },
        [delayed, setLocal],
    );

    const cancel = useCallback(() => {
        delayed.cancel();
        setLocal((s) => {
            s.isPending = false;
        });
    }, [delayed, setLocal]);

    const runNow = useCallback(
        (...args) => {
            delayed.runNow(...args);
            setLocal((s) => {
                s.isPending = false;
            });
        },
        [delayed, setLocal],
    );

    return {
        run,
        cancel,
        runNow,
        isPending,
    };
};

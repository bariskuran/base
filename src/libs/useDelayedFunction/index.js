import { useCallback, useMemo } from "react";
import { baseStore } from "../@baseStore";
import { delayedFunction } from "../delayedFunction";

export const useDelayedFunction = (fn, settings = {}) => {
    const { isPending, setLocal } = baseStore.useLocal({ isPending: false });

    const delayed = useMemo(
        () =>
            delayedFunction(
                (...args) => {
                    fn?.(...args);
                    setLocal((s) => {
                        s.isPending = false;
                    });
                },
                settings,
            ),
        [fn, settings, setLocal],
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



export const delayedFunction = (fn, settings = {}) => {
    const { delay = 500, autoCancel = true } = settings;

    let timeout = null;
    let lastArgs = null;

    const clear = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    const run = (...args) => {
        lastArgs = args;

        if (autoCancel) {
            clear();
        }

        timeout = setTimeout(() => {
            fn(...lastArgs);
            timeout = null;
            lastArgs = null;
        }, delay);
    };

    const cancel = () => {
        clear();
        lastArgs = null;
    };

    const runNow = (...args) => {
        const nextArgs = args.length ? args : lastArgs || [];
        if (timeout) {
            clear();
        }
        fn(...nextArgs);
        lastArgs = null;
    };

    const isPending = () => timeout != null;

    return {
        run,
        cancel,
        runNow,
        isPending,
    };
};

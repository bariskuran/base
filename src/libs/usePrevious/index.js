import { useCallback, useEffect, useRef } from "react";

export const usePrevious = (value) => {
    const ref = useRef(undefined);
    const listenersRef = useRef(new Set());

    const setPreviousValue = useCallback((next) => {
        ref.current = next;
    }, []);

    const onChange = useCallback((callback) => {
        if (typeof callback !== "function") return () => {};
        listenersRef.current.add(callback);
        return () => {
            listenersRef.current.delete(callback);
        };
    }, []);

    const previousValue = ref.current;

    useEffect(() => {
        if (previousValue !== value) {
            const payload = { previousValue, currentValue: value };
            listenersRef.current.forEach((callback) => {
                try {
                    callback(payload);
                } catch (error) {
                    console.error("usePrevious onChange listener error:", error);
                }
            });
        }
    }, [value, previousValue]);

    ref.current = value;

    return { previousValue, setPreviousValue, onChange };
};

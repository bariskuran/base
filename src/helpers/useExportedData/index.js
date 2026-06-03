import { useRef, useEffect, useCallback } from "react";
import { isShallowEqual } from "libs/isShallowEqual";
import { baseStore } from "libs/baseStore";

export const useExportData = ({ exportData, ...returnedData }, exportedData = {}) => {
    const prevRef = useRef();
    const latestRestRef = useRef(exportedData);

    latestRestRef.current = exportedData;

    useEffect(() => {
        if (typeof exportData !== "function") return;

        if (prevRef.current && isShallowEqual(prevRef.current, latestRestRef.current)) {
            return;
        }

        prevRef.current = latestRestRef.current;
        exportData(latestRestRef.current);
    });

    return { ...(exportedData || {}), ...(returnedData || {}) };
};

export const useExportedData = () => {
    const { exportedData, set } = baseStore.useLocal({ exportedData: null });

    const exportData = useCallback((data) => {
        set((s) => {
            if (isShallowEqual(s.exportedData, data)) return;
            s.exportedData = data;
        });
    }, []);

    return { ...(exportedData || {}), exportData };
};

import { useRef, useEffect, useCallback } from "react";
import { isShallowEqual } from "../isShallowEqual";
import { baseStore } from "../@baseStore";

/**
 * useVars hooku içerisindeki datayı hem komponente hem de exportData ile dışarıya döndürür. Bu advanced komponentlerdeki işleyişi sağlayan dataların dışarıda kullanılmasını sağlar.
 *
 * mesela ScrollBar içerisinde ciddi hesaplar var. Bunların komponent dışarısında kullanılması gerekebilir.
 */
/**
 * const { thumbLength, exportData } = useExportedData();
 * <ScrollBar exportData={exportData} />
 *
 * ScrollBar içerisinde, useVars kısmında
 * return useExportData({ ... data });
 *
 * useVars içerisinde return useExportData(data1,data2); şeklinde yapılır.
 * exportData data1 içerisinde olmalı.
 * DATA2 EXPORT EDİLİR, bunu karıştırıyorsun hep,
 * hem data1 hem data2 return edilir.
 */

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

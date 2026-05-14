import { useMemo, useCallback, useState } from "react";
import { useExportData } from "../../useExportedData";

const useVars = (p) => {
    const [isOpen, setIsOpen] = useState(false);

    const openPopTip = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closePopTip = useCallback(() => {
        setIsOpen(false);
    }, []);

    const floatingUiProps = useMemo(() => {
        const { exportData: _exportData, ...rest } = p || {};
        const next = { ...rest };
        delete next.primary;
        delete next.secondary;
        return {
            ...next,
            open: rest.open !== undefined ? rest.open : isOpen,
            closeHandler: typeof rest.closeHandler === "function" ? rest.closeHandler : closePopTip,
        };
    }, [p, isOpen, closePopTip, openPopTip]);

    /* Return */
    return useExportData(
        {
            exportData: p?.exportData,
            ...p,
            floatingUiProps,
        },
        { isOpen, openPopTip, closePopTip },
    );
};
export default useVars;

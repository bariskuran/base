import { baseStore } from "../../@baseStore";
import { useExportData } from "../../useExportedData";

const useVars = (p) => {
    const { setLocal, setLocalByPath, isOpen } = baseStore.useLocal({ isOpen: false });
    const openPopTip = () =>
        setLocal((s) => {
            s.isOpen = true;
        });
    const closePopTip = () =>
        setLocal((s) => {
            s.isOpen = false;
        });

    /* Return */
    return useExportData(
        {
            exportData: p.exportData,
            ...p,
            allProps: p,
            setLocal,
            setLocalByPath,
        },
        { isOpen, openPopTip, closePopTip },
    );
};
export default useVars;

// import { useRef, useEffect } from "react";
import { baseStore } from "../../@baseStore";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    // const {} = p || {};

    /**
     *
     * React
     **
     */

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
    return {
        ...p,
        allProps: p,
        setLocal,
        setLocalByPath,
        isOpen,
        openPopTip,
        closePopTip,
    };
};
export default useVars;

import { useMemo, useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { generateRandom } from "../../generateRandom";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    const { buttonProps, ...floatingUiProps } = p || {};

    /**
     *
     * React
     **
     */

    const uniqueId = useMemo(() => generateRandom.text(16), []);
    const [popoverId, setGlobal] = baseStore.useGlobal((s) => [s.popoverId]);
    const { isOpen, setLocal, setLocalByPath } = baseStore.useLocal({
        isOpen: false,
    });

    useEffect(() => {
        setLocalByPath("isOpen", popoverId === uniqueId);
    }, [popoverId]);

    const onClickHandler = () => {
        if (isOpen) {
            setGlobal((s) => {
                s.popoverId = null;
            });
        } else {
            setGlobal((s) => {
                s.popoverId = uniqueId;
            });
        }
    };

    /* Return */
    return {
        ...p,
        uniqueId,
        allProps: p,
        setLocal,
        setLocalByPath,
        isOpen,
        onClickHandler,
        buttonProps,
        floatingUiProps,
    };
};
export default useVars;

import { useMemo, useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { generateRandom } from "../../generateRandom";
import { useExportData } from "../../useExportedData";
import { useObserver } from "../../useObserver";

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

    const { ref: observerRef, inViewport } = useObserver({
        disable: !isOpen,
        onExit: () =>
            setGlobal((s) => {
                s.popoverId = null;
            }),
    });

    /* Return */
    return useExportData(
        {
            ...p,
            allProps: p,
            inViewport,
            setLocal,
            setLocalByPath,
            isOpen,
            onClickHandler,
            buttonProps,
            floatingUiProps,
            observerRef,
        },
        {
            uniqueId,
        },
    );
};
export default useVars;

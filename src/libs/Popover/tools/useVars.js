import { useMemo, useCallback, useRef } from "react";
import { baseStore } from "../../baseStore";
import { resolveFloatingUiProps } from "./resolveFloatingUiProps";
import { useExportData } from "helpers/useExportedData";

const useVars = (p) => {
    const { exportData, buttonProps = {}, scrollFlexProps = {}, onClose, ...rest } = p || {};
    const [theme] = baseStore.useGlobal((s) => [s.theme]);
    const { isOpen, set } = baseStore.useLocal({
        isOpen: false,
    });
    const dismissWithoutAnimationRef = useRef(false);

    const onCloseHandler = useCallback(() => {
        set((s) => {
            s.isOpen = false;
        });
        onClose?.();
    }, [onClose, set]);

    const requestClose = useCallback(
        (opts) => {
            if (opts?.instant) {
                dismissWithoutAnimationRef.current = true;
            }
            onCloseHandler();
        },
        [onCloseHandler],
    );

    const floatingUiPropsResolved = useMemo(
        () => resolveFloatingUiProps(rest, theme),
        [rest, theme],
    );

    const onClickHandler = () => {
        set((s) => {
            s.isOpen = !s.isOpen;
        });
    };

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            onCloseHandler,
            allProps: p,
            isOpen,
            onClickHandler,
            buttonProps,
            floatingUiProps: floatingUiPropsResolved,
            scrollFlexProps,
            dismissWithoutAnimationRef,
            requestClose,
        },
        {
            isOpen,
            onCloseHandler,
            onClose: onCloseHandler,
            requestClose,
        },
    );
};
export default useVars;

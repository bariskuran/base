import { useMemo, useCallback, useRef } from "react";
import { baseStore } from "../../baseStore";
import { resolvePathOrRaw } from "../../Button/tools/generateColors.js";
import { useExportData } from "../../useExportedData";

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

    const floatingUiPropsResolved = useMemo(() => {
        const next = { ...rest };
        const bg = next.bgColor;
        const fg = next.color;

        if (bg != null && bg !== "") {
            const r = resolvePathOrRaw(theme, typeof bg === "string" ? bg : String(bg));
            if (r != null) next.bgColor = r;
        }
        if (fg != null && fg !== "") {
            const r = resolvePathOrRaw(theme, typeof fg === "string" ? fg : String(fg));
            if (r != null) next.color = r;
        }

        if (next.popOverTriggerMarker == null) next.popOverTriggerMarker = true;
        if (next.disableAutoClose) {
            delete next.popOverOutsideDismiss;
        } else {
            next.popOverOutsideDismiss = true;
        }
        return next;
    }, [p, theme]);

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

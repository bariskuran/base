import { useCallback, useMemo, useRef } from "react";
import { useExportData } from "../../useExportedData";
import {
    DEFAULT_CANCEL_BUTTON_PROPS,
    DEFAULT_CONFIRM_BUTTON_PROPS,
    getDefaultConfirmationContent,
} from "./defaultPopConfirmProps";
import { mergeActionButtonProps } from "./mergeActionButtonProps";

const useVars = (p) => {
    const {
        exportData,
        children,
        confirmButtonProps: confirmButtonPropsProp,
        cancelButtonProps: cancelButtonPropsProp,
        confirmationContent: confirmationContentProp,
        ...popoverProps
    } = p || {};

    const popoverApiRef = useRef({
        onCloseHandler: null,
        requestClose: null,
    });

    const closePanel = useCallback((opts) => {
        popoverApiRef.current?.requestClose?.(opts);
        popoverApiRef.current?.onCloseHandler?.();
    }, []);

    const confirmationContent = confirmationContentProp ?? getDefaultConfirmationContent();

    const confirmButtonProps = useMemo(
        () =>
            mergeActionButtonProps(DEFAULT_CONFIRM_BUTTON_PROPS, confirmButtonPropsProp, () =>
                closePanel(),
            ),
        [closePanel, confirmButtonPropsProp],
    );

    const cancelButtonProps = useMemo(
        () =>
            mergeActionButtonProps(DEFAULT_CANCEL_BUTTON_PROPS, cancelButtonPropsProp, () =>
                closePanel(),
            ),
        [cancelButtonPropsProp, closePanel],
    );

    const handlePopoverExportData = useCallback(
        (api) => {
            if (api && typeof api === "object") {
                popoverApiRef.current = {
                    onCloseHandler: api.onCloseHandler,
                    requestClose: api.requestClose,
                };
            }

            exportData?.(api);
        },
        [exportData],
    );

    const popoverPropsResolved = useMemo(
        () => ({
            ...popoverProps,
            exportData: handlePopoverExportData,
        }),
        [handlePopoverExportData, popoverProps],
    );

    /* Return */
    return useExportData(
        {
            exportData,
            children,
            confirmButtonProps,
            cancelButtonProps,
            confirmationContent,
            popoverProps: popoverPropsResolved,
        },
        {},
    );
};

export default useVars;

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useExportData } from "../../useExportedData";
import {
    DEFAULT_CANCEL_BUTTON_PROPS,
    DEFAULT_CONFIRM_BUTTON_PROPS,
    getDefaultConfirmationContent,
} from "./defaultPopConfirmProps";
import {
    buildCancelButtonProps,
    buildConfirmButtonProps,
    invokeButtonActionProps,
    splitDeferredTriggerActions,
} from "./buttonActionProps";

const useVars = (p) => {
    const navigate = useNavigate();
    const {
        exportData,
        confirmButtonProps: confirmButtonPropsProp,
        cancelButtonProps: cancelButtonPropsProp,
        confirmationContent: confirmationContentProp,
        contentButtonProps: contentButtonPropsProp,
        ...popOverRest
    } = p || {};

    const popOverApiRef = useRef({
        requestClose: null,
    });

    const closeReasonRef = useRef(null);
    const cancelDismissActionsRef = useRef({});

    const [deferredTriggerActions, triggerButtonProps] = useMemo(
        () => splitDeferredTriggerActions(contentButtonPropsProp),
        [contentButtonPropsProp],
    );

    useEffect(() => {
        cancelDismissActionsRef.current = cancelButtonPropsProp || {};
    }, [cancelButtonPropsProp]);

    const closePanel = useCallback((opts) => {
        popOverApiRef.current?.requestClose?.(opts);
    }, []);

    const setCloseReason = useCallback((reason) => {
        closeReasonRef.current = reason;
    }, []);

    const handlePopOverClose = useCallback(() => {
        const reason = closeReasonRef.current;
        closeReasonRef.current = null;

        if (reason === "confirm" || reason === "cancel") return;

        invokeButtonActionProps(cancelDismissActionsRef.current, undefined, { navigate });
    }, [navigate]);

    const confirmationContent = confirmationContentProp ?? getDefaultConfirmationContent();

    const confirmButtonProps = useMemo(
        () =>
            buildConfirmButtonProps({
                defaults: DEFAULT_CONFIRM_BUTTON_PROPS,
                confirmProps: confirmButtonPropsProp,
                deferredFromTrigger: deferredTriggerActions,
                onPanelClose: closePanel,
                setCloseReason,
            }),
        [closePanel, confirmButtonPropsProp, deferredTriggerActions, setCloseReason],
    );

    const cancelButtonProps = useMemo(
        () =>
            buildCancelButtonProps({
                defaults: DEFAULT_CANCEL_BUTTON_PROPS,
                cancelProps: cancelButtonPropsProp,
                onPanelClose: closePanel,
                setCloseReason,
            }),
        [cancelButtonPropsProp, closePanel, setCloseReason],
    );

    const handlePopOverExportData = useCallback(
        (api) => {
            if (api && typeof api === "object") {
                popOverApiRef.current = {
                    requestClose: api.requestClose,
                };
            }

            exportData?.(api);
        },
        [exportData],
    );

    const popOverPropsResolved = useMemo(
        () => ({
            ...popOverRest,
            buttonProps: triggerButtonProps,
            onClose: handlePopOverClose,
            exportData: handlePopOverExportData,
        }),
        [handlePopOverClose, handlePopOverExportData, popOverRest, triggerButtonProps],
    );

    /* Return */
    return useExportData(
        {
            exportData,
            confirmButtonProps,
            cancelButtonProps,
            confirmationContent,
            popOverProps: popOverPropsResolved,
        },
        {},
    );
};

export default useVars;

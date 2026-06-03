import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExportData } from "helpers/useExportedData";
import {
    DEFAULT_CANCEL_BUTTON_PROPS,
    DEFAULT_CONFIRM_BUTTON_PROPS,
    DEFAULT_CONTENT_BUTTON_PROPS,
    getDefaultConfirmationContent,
} from "./defaultPopConfirmProps";
import {
    applyTriggerInteractionState,
    buildCancelButtonProps,
    buildConfirmButtonProps,
    invokeButtonActionProps,
    mergeContentButtonProps,
} from "./buttonActionProps";

const useVars = (p) => {
    const navigate = useNavigate();
    const {
        exportData,
        confirmButtonProps: confirmButtonPropsProp,
        cancelButtonProps: cancelButtonPropsProp,
        content: contentProp,
        contentButtonProps: contentButtonPropsProp,
        triggerDelayMs: triggerDelayMsProp,
        ...popOverRest
    } = p || {};

    const popOverApiRef = useRef({
        requestClose: null,
    });

    const closeReasonRef = useRef(null);
    const cancelDismissActionsRef = useRef({});
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [playConfirmClickEffect, setPlayConfirmClickEffect] = useState(false);

    const [deferredTriggerActions, baseTriggerButtonProps] = useMemo(
        () => mergeContentButtonProps(DEFAULT_CONTENT_BUTTON_PROPS, contentButtonPropsProp),
        [contentButtonPropsProp],
    );

    const triggerButtonProps = useMemo(
        () =>
            applyTriggerInteractionState(baseTriggerButtonProps, {
                isPanelOpen,
                playConfirmClickEffect,
            }),
        [baseTriggerButtonProps, isPanelOpen, playConfirmClickEffect],
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

    const content = contentProp ?? getDefaultConfirmationContent();

    const confirmButtonProps = useMemo(
        () =>
            buildConfirmButtonProps({
                defaults: DEFAULT_CONFIRM_BUTTON_PROPS,
                confirmProps: confirmButtonPropsProp,
                deferredFromTrigger: deferredTriggerActions,
                onPanelClose: closePanel,
                setCloseReason,
                setPlayConfirmClickEffect,
                navigate,
                triggerDelayMs: triggerDelayMsProp,
            }),
        [
            closePanel,
            confirmButtonPropsProp,
            deferredTriggerActions,
            navigate,
            setCloseReason,
            triggerDelayMsProp,
        ],
    );

    const cancelButtonProps = useMemo(
        () =>
            buildCancelButtonProps({
                defaults: DEFAULT_CANCEL_BUTTON_PROPS,
                cancelProps: cancelButtonPropsProp,
                onPanelClose: closePanel,
                setCloseReason,
                onCancel: () => setPlayConfirmClickEffect(false),
            }),
        [cancelButtonPropsProp, closePanel, setCloseReason],
    );

    const handlePopOverExportData = useCallback(
        (api) => {
            if (api && typeof api === "object") {
                popOverApiRef.current = {
                    requestClose: api.requestClose,
                };
                if (api.isOpen !== undefined) {
                    setIsPanelOpen(!!api.isOpen);
                }
            }

            exportData?.(api);
        },
        [exportData],
    );

    const popOverPropsResolved = useMemo(
        () => ({
            ...popOverRest,
            buttonProps: triggerButtonProps,
            disableTriggerToggle: isPanelOpen || playConfirmClickEffect,
            onClose: handlePopOverClose,
            exportData: handlePopOverExportData,
        }),
        [
            handlePopOverClose,
            handlePopOverExportData,
            isPanelOpen,
            playConfirmClickEffect,
            popOverRest,
            triggerButtonProps,
        ],
    );

    /* Return */
    return useExportData(
        {
            exportData,
            confirmButtonProps,
            cancelButtonProps,
            content,
            popOverProps: popOverPropsResolved,
        },
        {},
    );
};

export default useVars;

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { baseStore } from "../../baseStore";
import { useExportData } from "../../useExportedData";
import { useEventListener } from "../../useEventListener";
import { scrollLock } from "../../scrollLock";
import {
    invokeButtonActionProps,
    pickButtonActionProps,
} from "../../PopConfirm/tools/buttonActionProps";
import {
    DEFAULT_CANCEL_BUTTON_PROPS,
    DEFAULT_CLOSE_BUTTON_PROPS,
    DEFAULT_CONFIRM_BUTTON_PROPS,
    DEFAULT_USE_SCROLL_FLEX,
} from "./defaultPopUpProps";
import { mergeActionButtonProps } from "./mergeActionButtonProps";

export { PopUpBodyWrapper } from "./popUpBodyWrapper";

const useVars = (p) => {
    const navigate = useNavigate();
    const cancelDismissActionsRef = useRef({});

    const {
        exportData,
        forwardedRef,
        Variant: _Variant,
        __hasParentUiComponent: _hasParentUiComponent,
        variant: _variant,
        open: openProp,
        defaultOpen = false,
        onClose,
        onOpenChange,
        children,
        cancelButtonProps: cancelButtonPropsProp,
        confirmButtonProps: confirmButtonPropsProp,
        closeButtonProps: closeButtonPropsProp,
        disableBackdropClose = false,
        disableEscClose = false,
        lockScroll = true,
        zIndex = 100000,
        useScrollFlex = DEFAULT_USE_SCROLL_FLEX,
        scrollFlexProps,
        ...panelRest
    } = p || {};

    const isControlled = openProp !== undefined;
    const { isOpen: internalOpen, set } = baseStore.useLocal({
        isOpen: !!defaultOpen,
    });

    const isOpen = isControlled ? !!openProp : internalOpen;

    const hasCancelButton = cancelButtonPropsProp != null;
    const hasConfirmButton = confirmButtonPropsProp != null;
    const showFooter = hasCancelButton || hasConfirmButton;

    useEffect(() => {
        if (!hasCancelButton) {
            cancelDismissActionsRef.current = {};
            return;
        }
        cancelDismissActionsRef.current = cancelButtonPropsProp || {};
    }, [cancelButtonPropsProp, hasCancelButton]);

    const hasCancelDismissActions = useMemo(() => {
        if (!hasCancelButton) return false;
        return (
            Object.keys(pickButtonActionProps(cancelButtonPropsProp)).length > 0
        );
    }, [cancelButtonPropsProp, hasCancelButton]);

    const requestClose = useCallback(
        (reason, event) => {
            if (!isOpen) return;

            const shouldRunCancelDismiss =
                hasCancelDismissActions &&
                reason !== "cancel" &&
                reason !== "confirm";

            if (shouldRunCancelDismiss) {
                invokeButtonActionProps(cancelDismissActionsRef.current, event, {
                    navigate,
                });
            }

            if (!isControlled) {
                set((s) => {
                    s.isOpen = false;
                });
            }

            onOpenChange?.(false);
            onClose?.({ reason });
        },
        [
            hasCancelDismissActions,
            isControlled,
            isOpen,
            navigate,
            onClose,
            onOpenChange,
            set,
        ],
    );

    useEffect(() => {
        if (!lockScroll || !isOpen) return undefined;
        scrollLock(true);
        return () => scrollLock(false);
    }, [isOpen, lockScroll]);

    useEventListener(
        "keydown",
        (e) => {
            if (e.key !== "Escape") return;
            requestClose("esc");
        },
        {
            delay: 0,
            enabled: isOpen && !disableEscClose,
            source: typeof document !== "undefined" ? document : undefined,
        },
    );

    const handleBackdropClick = useCallback(() => {
        if (disableBackdropClose) return;
        requestClose("backdrop");
    }, [disableBackdropClose, requestClose]);

    const closeButtonProps = useMemo(
        () =>
            mergeActionButtonProps(
                DEFAULT_CLOSE_BUTTON_PROPS,
                closeButtonPropsProp,
                () => requestClose("close"),
            ),
        [closeButtonPropsProp, requestClose],
    );

    const cancelButtonProps = useMemo(() => {
        if (!hasCancelButton) return null;
        return mergeActionButtonProps(
            DEFAULT_CANCEL_BUTTON_PROPS,
            cancelButtonPropsProp,
            () => requestClose("cancel"),
        );
    }, [cancelButtonPropsProp, hasCancelButton, requestClose]);

    const confirmButtonProps = useMemo(() => {
        if (!hasConfirmButton) return null;
        return mergeActionButtonProps(
            DEFAULT_CONFIRM_BUTTON_PROPS,
            confirmButtonPropsProp,
            () => requestClose("confirm"),
        );
    }, [confirmButtonPropsProp, hasConfirmButton, requestClose]);

    /* Return */
    return useExportData(
        {
            exportData,
            isOpen,
            popUpContent: children,
            showFooter,
            hasCancelButton,
            hasConfirmButton,
            cancelButtonProps,
            confirmButtonProps,
            closeButtonProps,
            handleBackdropClick,
            forwardedRef,
            zIndex,
            useScrollFlex,
            scrollFlexProps,
            panelRest,
        },
        {
            isOpen,
            requestClose,
        },
    );
};

export default useVars;

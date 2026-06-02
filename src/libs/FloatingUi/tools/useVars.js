import { useRef, useEffect, useLayoutEffect, useMemo, useState, useCallback } from "react";
import { baseStore } from "../../baseStore";
import { useEventListener } from "../../useEventListener";
import { delayedFunction } from "../../delayedFunction";
import getPosition from "./getPosition";
import { colorGet } from "../../colorGet";
import { useExportData } from "../../useExportedData";
import { useObserver } from "../../useObserver";
import {
    acquireFloatingMountHost,
    ensureFloatingMountHost,
    pickFloatingMountRoot,
    releaseFloatingMountHost,
} from "./floatingMountHost";
import { generate4DirectionProps } from "../../Flex/tools/generateProps";
import { generateRandom } from "../../generateRandom";

const DEFAULT_FLOATING_PADDING = 10;

const POP_OVER_TRIGGER_SELECTOR = "[data-floating-ui-pop-over-trigger]";

const useVars = (p) => {
    const {
        open,
        alignX: alignXFromUser,
        alignY: alignYFromUser,
        disableArrow,
        onMouseEnter,
        onMouseLeave,
        onClick,
        Variant,
        bgColor,
        color,
        uniqueId,
        enableEscaping: enableEscapingProp,
        popOverOutsideDismiss: popOverOutsideDismissProp,
        closeHandler: closeHandlerFromChildComponent,
        exportData,
        dismissWithoutAnimationRef,
        resolveFloatingMount,
        padding,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        disableMultipleBlock = false,
        popOverTriggerMarker = false,
    } = p || {};

    const enableEscaping = enableEscapingProp === true;
    const popOverOutsideDismiss = popOverOutsideDismissProp === true;
    const listenOutsidePointer = popOverOutsideDismiss;
    const listenEscapeKey = enableEscaping;

    const floatingExclusiveId = useMemo(
        () => (uniqueId != null && uniqueId !== "" ? String(uniqueId) : generateRandom.text(16)),
        [],
    );

    const {
        isMounted,
        set,
        setByPath,
        positionX,
        positionY,
        alignX,
        alignY,
        blockVisibility,
        status,
    } = baseStore.useLocal({
        isMounted: false,
        positionX: 0,
        positionY: 0,
        alignX: "center",
        alignY: "top",
        blockVisibility: false,
        status: "closed",
    });
    const [referenceEl, setReferenceEl] = useState(null);
    const [floatingEl, setFloatingEl] = useState(null);

    const childrenRef = useRef(null);
    const floatingRef = useRef(null);
    const floatingMountHostRef = useRef(null);
    const closeHandlerFromChildRef = useRef(closeHandlerFromChildComponent);

    useEffect(() => {
        closeHandlerFromChildRef.current = closeHandlerFromChildComponent;
    }, [closeHandlerFromChildComponent]);

    const setFloatingNode = useCallback((node) => {
        floatingRef.current = node;
        setFloatingEl(node);
    }, []);

    useEffect(() => {
        setByPath("isMounted", true);
    }, [setByPath]);

    const setByPathRef = useRef(setByPath);
    setByPathRef.current = setByPath;

    const getPos = useCallback(() => {
        if (status !== "opened") return;

        getPosition({
            childrenRef,
            floatingRef,
            set,
            alignXFromUser,
            alignYFromUser,
            currentAlignX: alignX,
            currentAlignY: alignY,
            resolveFloatingMount,
            floatingLayerEl: floatingMountHostRef.current,
        });
    }, [status, set, alignXFromUser, alignYFromUser, alignX, alignY, resolveFloatingMount]);

    const delayMs = 500;
    const delayedClose = useMemo(
        () =>
            delayedFunction(
                () => {
                    setByPathRef.current("status", "closed");
                },
                { delay: delayMs },
            ),
        [delayMs],
    );

    const delayedCloseRef = useRef(delayedClose);
    delayedCloseRef.current = delayedClose;
    const [popOverId, setGlobal] = baseStore.useGlobal((s) => [s.popOverId, s.set]);

    const exclusiveBlocksOthers = !disableMultipleBlock;

    const effectiveOpen = useMemo(() => {
        if (!exclusiveBlocksOthers) return open;
        return open && (popOverId == null || popOverId === floatingExclusiveId);
    }, [open, exclusiveBlocksOthers, popOverId, floatingExclusiveId]);

    const prevOpenForExclusiveRef = useRef(false);

    useLayoutEffect(() => {
        if (!exclusiveBlocksOthers) return;
        if (!open || effectiveOpen) return;
        if (!prevOpenForExclusiveRef.current) return;
        closeHandlerFromChildRef.current?.({ instant: true });
    }, [exclusiveBlocksOthers, open, effectiveOpen]);
    useLayoutEffect(() => {
        if (disableMultipleBlock) return;
        const was = prevOpenForExclusiveRef.current;
        prevOpenForExclusiveRef.current = open;
        if (open && !was) {
            setGlobal((s) => {
                s.popOverId = floatingExclusiveId;
            });
        }
        if (!open && was) {
            setGlobal((s) => {
                if (s.popOverId === floatingExclusiveId) s.popOverId = null;
            });
        }
    }, [open, disableMultipleBlock, floatingExclusiveId, setGlobal]);

    const dismissInstant = useCallback(() => {
        if (status === "closing" || status === "closed") return;
        delayedClose.cancel();
        set((s) => {
            s.status = "closed";
            s.blockVisibility = true;
        });
        if (!disableMultipleBlock) {
            setGlobal((s) => {
                if (s.popOverId === floatingExclusiveId) s.popOverId = null;
            });
        }
    }, [status, delayedClose, set, setGlobal, disableMultipleBlock, floatingExclusiveId]);

    const openHandler = useCallback(() => {
        if (status === "opened") return;
        delayedClose.cancel();
        set((s) => {
            s.status = "opened";
            s.blockVisibility = true;
            s.alignX = alignXFromUser || "center";
            s.alignY = alignYFromUser || "top";
        });
    }, [status, set, alignXFromUser, alignYFromUser, delayedClose]);

    const closeHandler = useCallback((options) => {
        if (options?.instant) {
            closeHandlerFromChildRef.current?.({ instant: true });
            return;
        }
        closeHandlerFromChildRef.current?.();
    }, []);

    const closeFromOpenProp = useCallback(() => {
        if (status === "closing" || status === "closed") return;

        const instant =
            dismissWithoutAnimationRef != null && dismissWithoutAnimationRef.current === true;
        if (dismissWithoutAnimationRef) {
            dismissWithoutAnimationRef.current = false;
        }

        if (instant) {
            dismissInstant();
            return;
        }
        delayedClose.cancel();
        setByPath("status", "closing");
        delayedClose.run();
    }, [
        status,
        dismissWithoutAnimationRef,
        delayedClose,
        setByPath,
        dismissInstant,
    ]);

    useEffect(() => {
        if (!isMounted) return;
        if (!open) {
            closeFromOpenProp();
            return;
        }
        if (effectiveOpen) {
            openHandler();
            return;
        }
    }, [isMounted, open, effectiveOpen, openHandler, closeFromOpenProp]);

    useEffect(
        () => () => {
            delayedCloseRef.current.cancel();
        },
        [],
    );

    useLayoutEffect(() => {
        if (status !== "opened") return;
        getPos();
    }, [status, getPos]);

    const isFloatingActive = status === "opened" || status === "closing";

    const mountRootForHost = useMemo(() => {
        if (typeof document === "undefined" || !isFloatingActive) return null;
        if (referenceEl) return pickFloatingMountRoot(referenceEl, resolveFloatingMount);
        return document.body;
    }, [isFloatingActive, referenceEl, resolveFloatingMount]);

    useLayoutEffect(() => {
        if (!mountRootForHost) return undefined;
        acquireFloatingMountHost(mountRootForHost);
        return () => {
            releaseFloatingMountHost(mountRootForHost);
        };
    }, [mountRootForHost]);

    const floatingMountHost = useMemo(() => {
        if (!mountRootForHost) return null;
        return ensureFloatingMountHost(mountRootForHost);
    }, [mountRootForHost]);

    floatingMountHostRef.current = floatingMountHost;

    useEventListener("scroll", getPos, {
        enabled: status === "opened",
        delay: 0,
        isThrottle: false,
        passive: true,
        capture: true,
        source: typeof document !== "undefined" ? document : undefined,
    });

    useEventListener(
        ["scroll", "resize"],
        getPos,
        {
            enabled:
                status === "opened" &&
                typeof window !== "undefined" &&
                Boolean(window.visualViewport),
            delay: 0,
            isThrottle: false,
            passive: true,
            source: typeof window !== "undefined" ? window.visualViewport : undefined,
        },
    );

    const floatingPadding = useMemo(
        () =>
            generate4DirectionProps([
                padding != null && padding !== "" ? padding : DEFAULT_FLOATING_PADDING,
                paddingTop,
                paddingRight,
                paddingBottom,
                paddingLeft,
            ]),
        [padding, paddingTop, paddingRight, paddingBottom, paddingLeft],
    );

    const { ref: observedChildrenRef } = useObserver({
        disable: !isFloatingActive,
        threshold: 0,
        customViewportMargin: 0,
        onExit: () => {
            closeHandler({ instant: true });
        },
    });

    const setChildrenNode = useCallback(
        (node) => {
            childrenRef.current = node;
            setReferenceEl(node);
            observedChildrenRef(node);
        },
        [observedChildrenRef],
    );

    useEventListener("resize", getPos, {
        enabled: status === "opened",
        delay: 100,
        passive: true,
    });

    useLayoutEffect(() => {
        if (status !== "opened" || !referenceEl || !floatingEl) return;
        if (typeof ResizeObserver === "undefined") return;

        let frame = null;
        const schedulePosition = () => {
            if (frame != null) return;
            frame = requestAnimationFrame(() => {
                frame = null;
                getPos();
            });
        };

        const ro = new ResizeObserver(schedulePosition);
        ro.observe(referenceEl);
        ro.observe(floatingEl);
        schedulePosition();

        return () => {
            ro.disconnect();
            if (frame != null) cancelAnimationFrame(frame);
        };
    }, [status, referenceEl, floatingEl, getPos]);

    useEventListener(
        "pointerdown",
        (e) => {
            if (!isFloatingActive || !listenOutsidePointer) return;

            const target = e.target;
            const triggerEl = childrenRef.current;
            const floatingEl = floatingRef.current;

            if (triggerEl?.contains(target) || floatingEl?.contains(target)) return;

            if (
                disableMultipleBlock &&
                typeof Element !== "undefined" &&
                target instanceof Element &&
                typeof target.closest === "function" &&
                target.closest(POP_OVER_TRIGGER_SELECTOR)
            ) {
                return;
            }

            closeHandler();
        },
        {
            delay: 0,
            passive: true,
            capture: true,
            enabled: isFloatingActive && listenOutsidePointer,
            source: typeof document !== "undefined" ? document : undefined,
        },
    );

    useEventListener(
        "keydown",
        (e) => {
            if (!isFloatingActive || !listenEscapeKey) return;
            if (e.key !== "Escape") return;

            closeHandler();
        },
        {
            delay: 0,
            enabled: isFloatingActive && listenEscapeKey,
            source: typeof document !== "undefined" ? document : undefined,
        },
    );

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const colors = colorGet(bgColor || theme.background);

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            delayMs,
            status,
            colors,
            Variant,
            set,
            setByPath,
            childrenRef: setChildrenNode,
            floatingRef: setFloatingNode,
            open,
            alignX,
            alignY,
            disableArrow,
            color,
            onMouseEnter,
            onMouseLeave,
            onClick,
            closeHandler,
            popOverTriggerMarker,
        },
        {
            isMounted,
            positionX,
            positionY,
            blockVisibility,
            floatingMountHost,
            floatingPadding,
        },
    );
};
export default useVars;

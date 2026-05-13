import { useRef, useEffect, useLayoutEffect, useMemo, useState, useCallback } from "react";
import { baseStore } from "../../@baseStore";
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

const useVars = (p) => {
    const {
        open,
        alignX: alignXFromUser,
        alignY: alignYFromUser,
        disableArrow,
        primary,
        secondary,
        onMouseEnter,
        onMouseLeave,
        onClick,
        Variant,
        bgColor,
        color,
        uniqueId,
        enableEscaping,
        closeHandler: closeHandlerFromChildComponent,
        exportData,
        dismissWithoutAnimationRef,
        resolveFloatingMount,
        padding,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    } = p || {};

    const {
        isMounted,
        setLocal,
        setLocalByPath,
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
        setLocalByPath("isMounted", true);
    }, [setLocalByPath]);

    const setLocalByPathRef = useRef(setLocalByPath);
    setLocalByPathRef.current = setLocalByPath;

    const getPos = useCallback(() => {
        if (status !== "opened") return;

        getPosition({
            childrenRef,
            floatingRef,
            setLocal,
            alignXFromUser,
            alignYFromUser,
            currentAlignX: alignX,
            currentAlignY: alignY,
            resolveFloatingMount,
            floatingLayerEl: floatingMountHostRef.current,
        });
    }, [status, setLocal, alignXFromUser, alignYFromUser, alignX, alignY, resolveFloatingMount]);

    const delayMs = 500;
    const delayedClose = useMemo(
        () =>
            delayedFunction(
                () => {
                    setLocalByPathRef.current("status", "closed");
                },
                { delay: delayMs },
            ),
        [delayMs],
    );

    const delayedCloseRef = useRef(delayedClose);
    delayedCloseRef.current = delayedClose;
    const [popoverId, setGlobal] = baseStore.useGlobal((s) => [s.popoverId]);

    const dismissInstant = useCallback(() => {
        if (status === "closing" || status === "closed") return;
        delayedClose.cancel();
        setLocal((s) => {
            s.status = "closed";
            s.blockVisibility = true;
        });
        setGlobal((s) => {
            s.popoverId = null;
        });
    }, [status, delayedClose, setLocal, setGlobal]);

    const openHandler = useCallback(() => {
        if (status === "opened") return;
        delayedClose.cancel();
        setLocal((s) => {
            s.status = "opened";
            s.blockVisibility = true;
            s.alignX = alignXFromUser || "center";
            s.alignY = alignYFromUser || "top";
        });

        if (popoverId && popoverId !== uniqueId) {
            setGlobal((s) => {
                s.popoverId = null;
            });
        }
    }, [status, setLocal, alignXFromUser, alignYFromUser, delayedClose, popoverId, uniqueId, setGlobal]);

    const closeHandler = useCallback(
        (options) => {
            if (options?.instant) dismissInstant();
            else closeHandlerFromChildRef.current?.();
        },
        [dismissInstant],
    );

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
        setLocalByPath("status", "closing");
        delayedClose.run();

        setGlobal((s) => {
            s.popoverId = null;
        });
    }, [status, dismissWithoutAnimationRef, delayedClose, setLocalByPath, setGlobal, dismissInstant]);

    useEffect(() => {
        if (!isMounted) return;
        if (open) openHandler();
        else closeFromOpenProp();
    }, [open, isMounted, openHandler, closeFromOpenProp]);

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
                padding,
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
        rootMargin: 0,
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
            if (!isFloatingActive || !enableEscaping) return;

            const target = e.target;
            const triggerEl = childrenRef.current;
            const floatingEl = floatingRef.current;

            if (triggerEl?.contains(target) || floatingEl?.contains(target)) return;

            closeHandler();
        },
        {
            delay: 0,
            passive: true,
            source: typeof document !== "undefined" ? document : undefined,
        },
    );

    useEventListener(
        "keydown",
        (e) => {
            if (!isFloatingActive || !enableEscaping) return;
            if (e.key !== "Escape") return;

            closeHandler();
        },
        {
            delay: 0,
            source: typeof document !== "undefined" ? document : undefined,
        },
    );

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const colors = colorGet(
        bgColor || (primary ? theme.primary : secondary ? theme.secondary : theme.background),
    );

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            delayMs,
            status,
            colors,
            Variant,
            setLocal,
            setLocalByPath,
            childrenRef: setChildrenNode,
            floatingRef: setFloatingNode,
            open,
            alignX,
            alignY,
            disableArrow,
            primary,
            secondary,
            color,
            onMouseEnter,
            onMouseLeave,
            onClick,
            closeHandler,
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

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { baseStore } from "../../@baseStore";
import { useEventListener } from "../../useEventListener";
import { delayedFunction } from "../../delayedFunction";
import getPosition from "./getPosition";
import { colorGet } from "../../colorGet";
import { useExportData } from "../../useExportedData";
import { useFloatingAutoUpdate } from "./useFloatingAutoUpdate";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
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
        exportData,
        /** When true at close time, skip "closing" + transition (e.g. anchor moved). */
        dismissWithoutAnimationRef,
    } = p || {};

    /**
     *
     * State
     **
     */
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

    const setChildrenNode = useCallback((node) => {
        childrenRef.current = node;
        setReferenceEl(node);
    }, []);

    const setFloatingNode = useCallback((node) => {
        floatingRef.current = node;
        setFloatingEl(node);
    }, []);

    useEffect(() => {
        setLocalByPath("isMounted", true);
    }, []);

    const getPos = useCallback(() => {
        if (status === "closed") return;

        getPosition({
            childrenRef,
            floatingRef,
            setLocal,
            alignXFromUser,
            alignYFromUser,
            currentAlignX: alignX,
            currentAlignY: alignY,
        });
    }, [status, setLocal, alignXFromUser, alignYFromUser, alignX, alignY]);

    /**
     *
     * Manage Status
     **
     */
    const delayMs = 500;
    const delayedClose = useMemo(
        () =>
            delayedFunction(
                () => {
                    setLocalByPath("status", "closed");
                },
                { delay: delayMs },
            ),
        [setLocalByPath],
    );
    const delayedOpen = useMemo(
        () =>
            delayedFunction(
                () => {
                    setLocalByPath("status", "opened");
                },
                { delay: delayMs },
            ),
        [setLocalByPath],
    );

    const [popoverId, setGlobal] = baseStore.useGlobal((s) => [s.popoverId]);

    const openHandler = () => {
        if (status === "opening" || status === "opened") return;
        setLocalByPath("status", "opening");
        delayedClose.cancel();
        delayedOpen.run();

        if (popoverId && popoverId !== uniqueId) {
            setGlobal((s) => {
                s.popoverId = null;
            });
        }
    };

    const closeHandler = () => {
        if (status === "closing" || status === "closed") return;

        const instant =
            dismissWithoutAnimationRef != null && dismissWithoutAnimationRef.current === true;
        if (dismissWithoutAnimationRef) {
            dismissWithoutAnimationRef.current = false;
        }

        delayedOpen.cancel();

        if (instant) {
            delayedClose.cancel();
            setLocalByPath("status", "closed");
        } else {
            setLocalByPath("status", "closing");
            delayedClose.run();
        }

        setGlobal((s) => {
            s.popoverId = null;
        });
    };

    useEffect(() => {
        if (!isMounted) return;
        if (open) openHandler();
        else closeHandler();
        return () => {
            delayedClose.cancel();
            delayedOpen.cancel();
        };
    }, [open, isMounted]);

    useEffect(() => {
        if (status !== "opening") return;
        getPos();
    }, [status]);

    useEventListener("resize", getPos, {
        delay: 500,
        passive: true,
        onStart: () => setLocalByPath("blockVisibility", true),
        onEnd: () => setLocalByPath("blockVisibility", false),
    });

    useEventListener(
        "pointerdown",
        (e) => {
            if (!open || !enableEscaping) return;

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
            if (!open || !enableEscaping) return;
            if (e.key !== "Escape") return;

            closeHandler();
        },
        {
            delay: 0,
            source: typeof document !== "undefined" ? document : undefined,
        },
    );

    /**
     *
     *
     * Other Vars
     */

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const colors = colorGet(
        bgColor || (primary ? theme.primary : secondary ? theme.secondary : theme.background),
    );

    useFloatingAutoUpdate({
        open: (status === "opening" || status === "opened") && !!referenceEl && !!floatingEl,
        referenceEl,
        floatingEl,
        onUpdate: getPos,
    });

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
        },
        { isMounted, positionX, positionY, blockVisibility },
    );
};
export default useVars;

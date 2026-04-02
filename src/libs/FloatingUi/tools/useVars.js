import { useRef, useEffect, useMemo } from "react";
import { baseStore } from "../../@baseStore";
import { useEventListener } from "../../useEventListener";
import { delayedFunction } from "../../delayedFunction";
import { DefaultVariant } from "../DefaultVariant";
import getPosition from "./getPosition";
import { colorGet } from "../../colorGet";

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
        variant,
        bgColor,
        uniqueId,
        enableEscaping,
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
    const childrenRef = useRef(null);
    const floatingRef = useRef(null);

    useEffect(() => {
        setLocalByPath("isMounted", true);
    }, []);

    const getPos = () => {
        if (status === "closed") return;

        requestAnimationFrame(() => {
            getPosition({
                childrenRef,
                floatingRef,
                setLocal,
                alignXFromUser,
                alignYFromUser,
            });
        });
    };

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

        setLocalByPath("status", "closing");

        setGlobal((s) => {
            s.popoverId = null;
        });

        delayedOpen.cancel();
        delayedClose.run();
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

    const [theme, defaultVariants] = baseStore.useGlobal((s) => [s.theme, s.defaultVariants]);
    const Variant = variant || defaultVariants?.floatingUi || DefaultVariant;

    const colors = colorGet(
        bgColor || (primary ? theme.primary : secondary ? theme.secondary : theme.background),
    );

    /* Return */
    return {
        ...p,
        delayMs,
        status,
        colors,
        Variant,
        setLocal,
        setLocalByPath,
        isMounted,
        childrenRef,
        floatingRef,
        open,
        positionX,
        positionY,
        alignX,
        alignY,
        blockVisibility,
        disableArrow,
        primary,
        secondary,
        onMouseEnter,
        onMouseLeave,
        onClick,
    };
};
export default useVars;

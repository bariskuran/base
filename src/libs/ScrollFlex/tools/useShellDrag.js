import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { computeDragScrollFromPointers } from "./computeDragScrollDelta";
import { lockShellTextSelection, unlockShellTextSelection } from "./shellTextSelection";

export const useShellDrag = ({ enabled, shellRef, contentRef }) => {
    const dragRef = useRef({
        active: false,
        x0: 0,
        y0: 0,
        s0l: 0,
        s0t: 0,
        pid: null,
    });

    const [shellDragging, setShellDragging] = useState(false);

    const endShellDrag = useCallback(() => {
        const el = contentRef.current;
        const pid = dragRef.current.pid;

        dragRef.current = {
            active: false,
            x0: 0,
            y0: 0,
            s0l: 0,
            s0t: 0,
            pid: null,
        };

        setShellDragging(false);
        unlockShellTextSelection(el);

        if (el != null && pid != null) {
            try {
                el.releasePointerCapture(pid);
            } catch {
                /* ignore */
            }
        }
    }, [contentRef]);

    useEffect(() => () => endShellDrag(), [endShellDrag]);

    const shellPointerDown = useCallback(
        (e) => {
            if (!enabled) return;
            if (e.pointerType === "mouse" && e.button !== 0) return;

            const el = shellRef.current;
            const surfaceEl = contentRef.current;

            if (!el || !surfaceEl || e.currentTarget !== surfaceEl) return;

            const interactiveSelector =
                "a,button,input,textarea,select,label,[contenteditable=true],[role=button]";

            if (e.target !== surfaceEl && e.target?.closest?.(interactiveSelector)) {
                return;
            }

            dragRef.current = {
                active: true,
                x0: e.clientX,
                y0: e.clientY,
                s0l: el.scrollLeft,
                s0t: el.scrollTop,
                pid: e.pointerId,
            };

            if (e.cancelable) e.preventDefault();

            lockShellTextSelection(surfaceEl);
            setShellDragging(true);

            try {
                surfaceEl.setPointerCapture(e.pointerId);
            } catch {
                /* ignore */
            }
        },
        [contentRef, enabled, shellRef],
    );

    const shellPointerMove = useCallback(
        (e) => {
            if (!dragRef.current.active) return;
            if (e.cancelable) e.preventDefault();

            const el = shellRef.current;
            if (!el) return;

            const d = dragRef.current;
            const next = computeDragScrollFromPointers(
                { x: d.x0, y: d.y0 },
                { x: e.clientX, y: e.clientY },
                { scrollLeft: d.s0l, scrollTop: d.s0t },
            );

            el.scrollLeft = next.scrollLeft;
            el.scrollTop = next.scrollTop;
        },
        [shellRef],
    );

    const shellPointerUp = useCallback(
        (e) => {
            if (!dragRef.current.active) return;

            if (e.type === "lostpointercapture" || e.type === "pointercancel") {
                endShellDrag();
                return;
            }

            if (dragRef.current.pid != null && e.pointerId !== dragRef.current.pid) return;

            endShellDrag();
        },
        [endShellDrag],
    );

    const shellDragStartCapture = useCallback((e) => {
        if (!dragRef.current.active) return;
        e.preventDefault();
    }, []);

    const shellSurfaceStyle = useMemo(() => {
        if (!enabled) return undefined;

        return {
            cursor: shellDragging ? "grabbing" : "grab",
            touchAction: "none",
        };
    }, [enabled, shellDragging]);

    const shellPointerHandlers = useMemo(() => {
        if (!enabled) return {};

        return {
            onPointerDown: shellPointerDown,
            onPointerMove: shellPointerMove,
            onPointerUp: shellPointerUp,
            onPointerCancel: shellPointerUp,
            onLostPointerCapture: shellPointerUp,
            onDragStartCapture: shellDragStartCapture,
        };
    }, [
        enabled,
        shellDragStartCapture,
        shellPointerDown,
        shellPointerMove,
        shellPointerUp,
    ]);

    return {
        shellSurfaceStyle,
        shellPointerHandlers,
    };
};

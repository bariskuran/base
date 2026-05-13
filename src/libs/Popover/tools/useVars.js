import { useMemo, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { baseStore } from "../../@baseStore";
import { resolvePathOrRaw } from "../../Button/tools/generateColors.js";
import { generateRandom } from "../../generateRandom";
import { useExportData } from "../../useExportedData";

const FLOATING_UI_SELECTOR = '[aria-label="floating-ui"]';

const rectsDiffer = (a, b, eps) =>
    Math.abs(a.top - b.top) > eps ||
    Math.abs(a.left - b.left) > eps ||
    Math.abs(a.width - b.width) > eps ||
    Math.abs(a.height - b.height) > eps;

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    const { exportData, buttonProps, scrollBoxProps = {}, scrollFlexProps = {} } = p || {};

    const mergedScrollBoxProps = { ...scrollFlexProps, ...scrollBoxProps };

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const floatingUiPropsResolved = useMemo(() => {
        const {
            exportData: _exportData,
            buttonProps: _buttonProps,
            scrollBoxProps: _scrollBoxProps = {},
            scrollFlexProps: _scrollFlexProps = {},
            ...rest
        } = p || {};
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
        return next;
    }, [p, theme]);

    /**
     *
     * React
     **
     */

    const uniqueId = useMemo(() => generateRandom.text(16), []);
    const [popoverId, setGlobal] = baseStore.useGlobal((s) => [s.popoverId]);
    const { isOpen, setLocal, setLocalByPath } = baseStore.useLocal({
        isOpen: false,
    });

    useEffect(() => {
        setLocalByPath("isOpen", popoverId === uniqueId);
    }, [popoverId, uniqueId, setLocalByPath]);

    const onClickHandler = () => {
        if (isOpen) {
            setGlobal((s) => {
                s.popoverId = null;
            });
        } else {
            setGlobal((s) => {
                s.popoverId = uniqueId;
            });
        }
    };

    const triggerElRef = useRef(null);
    const anchorSnapshotRef = useRef(null);
    const rafRef = useRef(null);
    const dismissWithoutAnimationRef = useRef(false);

    const observerRef = useCallback((node) => {
        triggerElRef.current = node;
    }, []);

    const closePopover = useCallback(() => {
        dismissWithoutAnimationRef.current = true;
        setGlobal((s) => {
            s.popoverId = null;
        });
    }, [setGlobal]);

    const checkAnchorMoved = useCallback(() => {
        if (!isOpen || popoverId !== uniqueId) return;
        const el = triggerElRef.current;
        const snap = anchorSnapshotRef.current;
        if (!el || !snap) return;
        const r = el.getBoundingClientRect();
        const next = { top: r.top, left: r.left, width: r.width, height: r.height };
        if (rectsDiffer(snap, next, 1)) {
            closePopover();
        }
    }, [isOpen, popoverId, uniqueId, closePopover]);

    const scheduleAnchorCheck = useCallback(() => {
        if (rafRef.current != null) return;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            checkAnchorMoved();
        });
    }, [checkAnchorMoved]);

    useLayoutEffect(() => {
        if (!isOpen) {
            anchorSnapshotRef.current = null;
            return;
        }

        const el = triggerElRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        anchorSnapshotRef.current = {
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
        };

        const onScrollCapture = (e) => {
            if (!isOpen || popoverId !== uniqueId) return;
            const t = e.target;
            if (t && t.nodeType === 1 && typeof t.closest === "function") {
                if (t.closest(FLOATING_UI_SELECTOR)) return;
            }
            closePopover();
        };

        const onVisualViewportScroll = () => {
            if (!isOpen || popoverId !== uniqueId) return;
            closePopover();
        };

        window.addEventListener("resize", scheduleAnchorCheck);
        document.addEventListener("scroll", onScrollCapture, true);

        const vv = typeof window !== "undefined" ? window.visualViewport : null;
        if (vv) {
            vv.addEventListener("resize", scheduleAnchorCheck);
            vv.addEventListener("scroll", onVisualViewportScroll);
        }

        return () => {
            window.removeEventListener("resize", scheduleAnchorCheck);
            document.removeEventListener("scroll", onScrollCapture, true);
            if (vv) {
                vv.removeEventListener("resize", scheduleAnchorCheck);
                vv.removeEventListener("scroll", onVisualViewportScroll);
            }
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [isOpen, popoverId, uniqueId, scheduleAnchorCheck, closePopover]);

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            allProps: p,
            setLocal,
            setLocalByPath,
            isOpen,
            onClickHandler,
            buttonProps,
            floatingUiProps: floatingUiPropsResolved,
            scrollBoxProps: mergedScrollBoxProps,
            observerRef,
            dismissWithoutAnimationRef,
        },
        {
            uniqueId,
        },
    );
};
export default useVars;

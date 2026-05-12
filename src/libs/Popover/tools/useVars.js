import { useMemo, useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { resolvePathOrRaw } from "../../Button/tools/generateColors.js";
import { generateRandom } from "../../generateRandom";
import { useExportData } from "../../useExportedData";
import { useObserver } from "../../useObserver";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    const {
        exportData,
        buttonProps,
        scrollBoxProps = {},
        scrollFlexProps = {},
    } = p || {};

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
    }, [popoverId]);

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

    const { ref: observerRef, inViewport } = useObserver({
        disable: !isOpen,
        onExit: () =>
            setGlobal((s) => {
                s.popoverId = null;
            }),
    });

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            allProps: p,
            inViewport,
            setLocal,
            setLocalByPath,
            isOpen,
            onClickHandler,
            buttonProps,
            floatingUiProps: floatingUiPropsResolved,
            scrollBoxProps: mergedScrollBoxProps,
            observerRef,
        },
        {
            uniqueId,
        },
    );
};
export default useVars;

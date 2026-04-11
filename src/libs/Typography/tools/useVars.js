import { useMemo, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { useExportData } from "../../useExportedData";
import { colorGet } from "../../colorGet";
import { normalizeCssSize } from "../../normalizeCssSize";
import { baseStore } from "../../@baseStore";
import { getTruncatedContent } from "./getTruncatedContent";

const sysDefaults = {
    as: "span",
    //
    weight: 400,
    whiteSpace: "normal",
    overflow: "visible",
    letterSpacing: 0,
    lineHeight: 1.2,
    selfAlign: "left",
};

const useVars = ({ children, content, ...p }) => {
    const [theme, currentBreakpoint] = baseStore.useGlobal((s) => [
        s.theme,
        s._clientData.currentBreakpoint,
    ]);
    const { truncatedContent, setLocal } = baseStore.useLocal({
        truncatedContent: null,
    });
    const ref = useRef(null);
    const setContent = useCallback(
        (content) => {
            setLocal((s) => {
                s.truncatedContent = content;
            });
        },
        [setLocal],
    );
    const isEllipsisBase = p.ellipsis === "base";

    const controlledProps = useMemo(() => {
        const responsiveProps = p.responsive?.[currentBreakpoint] || {};
        const mergedProps = { ...sysDefaults, ...p, ...responsiveProps };

        const { maxWidth, size, color, highlight, width } = mergedProps || {};

        const clr = colorGet(color || theme.foreground);
        const highlightClr = colorGet(highlight || clr.opposite);

        return {
            ...mergedProps,
            width: normalizeCssSize(width),
            maxWidth: normalizeCssSize(maxWidth),
            size: normalizeCssSize(size),
            color: color ? clr.color : highlight ? highlightClr.opposite : theme.foreground,
            highlight: highlight ? colorGet(highlight || clr.opposite)?.color : undefined,
        };
    }, [p, currentBreakpoint]);

    const recalculateTruncation = useCallback(() => {
        if (!isEllipsisBase || !ref.current) {
            setContent(null);
            return;
        }

        const newContent = children ?? content;

        const newTruncatedContent = getTruncatedContent({
            ref,
            content: newContent,
            clamp: p.clamp || 1,
            suffix: "...",
            truncateBy: "word",
        });

        setContent(newTruncatedContent);
    }, [children, content, isEllipsisBase, p.clamp, setContent]);

    useLayoutEffect(() => {
        recalculateTruncation();
    }, [recalculateTruncation]);

    useEffect(() => {
        if (!isEllipsisBase || !ref.current) return;

        const el = ref.current;
        const parent = el.parentElement;

        let frameId = null;

        const run = () => {
            if (frameId) cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                recalculateTruncation();
            });
        };

        const observer = new ResizeObserver(() => {
            run();
        });

        observer.observe(el);
        if (parent) observer.observe(parent);

        return () => {
            observer.disconnect();
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [isEllipsisBase, recalculateTruncation]);

    return useExportData({ ...controlledProps, isEllipsisBase, ref, truncatedContent }, {});
};

export default useVars;

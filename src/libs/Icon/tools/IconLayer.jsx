import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LayerSvg } from "./styled";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const scheduleFrame = (callback) => {
    if (typeof requestAnimationFrame === "function") {
        return { type: "frame", id: requestAnimationFrame(callback) };
    }

    return { type: "timeout", id: setTimeout(callback, 0) };
};

const cancelFrame = (frame) => {
    if (!frame) return;

    if (frame.type === "frame" && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(frame.id);
        return;
    }

    clearTimeout(frame.id);
};

const getContentKey = (Content) => {
    if (typeof Content === "string") return Content;
    if (typeof Content === "function") return Content;
    return Content ?? null;
};

const hashString = (value) => {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) | 0;
    }

    return Math.abs(hash).toString(36);
};

const getMetaKey = (meta) => {
    if (!meta) return null;

    return [
        meta.viewW,
        meta.viewH,
        meta.contentBounds?.minX,
        meta.contentBounds?.minY,
        meta.contentBounds?.width,
        meta.contentBounds?.height,
        getContentKey(meta.Content),
    ];
};

const getMetaSignature = (meta) => {
    if (!meta) return "none";

    const contentKey = getContentKey(meta.Content);
    const contentSignature =
        typeof contentKey === "string"
            ? hashString(contentKey)
            : typeof contentKey === "function"
              ? contentKey.name || "fn"
              : String(contentKey);

    return [
        meta.viewW,
        meta.viewH,
        meta.contentBounds?.minX || 0,
        meta.contentBounds?.minY || 0,
        meta.contentBounds?.width || 0,
        meta.contentBounds?.height || 0,
        contentSignature,
    ].join(":");
};

export const IconLayer = ({
    meta,
    visible,
    fill,
    scale = 1,
    enablePulse,
    isActive,
    spinPending,
    isFlag = false,
    disableOpticalScale = false,
    trimToContentBounds = false,
}) => {
    const metaKey = useMemo(() => getMetaKey(meta), [meta]);
    const metaKeyRef = useRef(metaKey);
    const metaRef = useRef(meta);
    const frameRef = useRef(null);
    const timeoutRef = useRef(null);
    const visibleRef = useRef(visible);
    const [swap, setSwap] = useState({
        previousMeta: null,
        showCurrent: true,
        showPrevious: false,
    });

    useIsoLayoutEffect(() => {
        const previousKey = metaKeyRef.current;
        const metaChanged =
            previousKey &&
            metaKey &&
            previousKey.some((value, index) => value !== metaKey[index]);
        const wasVisible = visibleRef.current;

        cancelFrame(frameRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (visible && metaChanged) {
            setSwap({
                previousMeta: metaRef.current,
                showCurrent: false,
                showPrevious: true,
            });

            frameRef.current = scheduleFrame(() => {
                setSwap((current) => ({
                    ...current,
                    showCurrent: true,
                    showPrevious: false,
                }));
            });

            timeoutRef.current = setTimeout(() => {
                setSwap((current) => ({
                    ...current,
                    previousMeta: null,
                }));
            }, 260);
        } else if (!visible && wasVisible && metaChanged) {
            setSwap({
                previousMeta: null,
                showCurrent: true,
                showPrevious: false,
            });
        } else {
            setSwap((current) =>
                current.previousMeta
                    ? current
                    : { previousMeta: null, showCurrent: true, showPrevious: false },
            );
        }

        metaKeyRef.current = metaKey;
        metaRef.current = meta;
        visibleRef.current = visible;

        return () => {
            cancelFrame(frameRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [meta, metaKey, visible]);

    if (!meta) return null;

    const renderLayer = (layerMeta, layerVisible, keyPrefix, isPrevious = false) => {
        if (!layerMeta) return null;

        const { Content, viewW, viewH, contentBounds, opticalScale, centerX, centerY } = layerMeta;
        const resolvedOpticalScale = disableOpticalScale ? 1 : opticalScale;
        const renderBounds = trimToContentBounds && contentBounds ? contentBounds : null;
        const renderX = renderBounds?.minX || 0;
        const renderY = renderBounds?.minY || 0;
        const renderW = renderBounds?.width || viewW;
        const renderH = renderBounds?.height || viewH;

        const opticalTransform =
            resolvedOpticalScale === 1
                ? undefined
                : `translate(${centerX} ${centerY}) scale(${resolvedOpticalScale}) translate(${-centerX} ${-centerY})`;

        const content =
            typeof Content === "string" ? (
                isFlag && Content.startsWith("data:image/") ? (
                    <image
                        href={Content}
                        xlinkHref={Content}
                        x="0"
                        y="0"
                        width={viewW}
                        height={viewH}
                    />
                ) : (
                    <path d={Content} />
                )
            ) : Content ? (
                <Content />
            ) : null;

        return (
            <LayerSvg
                key={`${keyPrefix}-${getMetaSignature(layerMeta)}`}
                $visible={layerVisible}
                $scale={scale}
                $spin={!isPrevious && spinPending}
                $enablePulse={!isPrevious && enablePulse}
                $isActive={!isPrevious && isActive}
                $fill={fill}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox={`${renderX} ${renderY} ${renderW} ${renderH}`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                focusable="false"
            >
                {opticalTransform ? <g transform={opticalTransform}>{content}</g> : content}
            </LayerSvg>
        );
    };

    return (
        <>
            {renderLayer(swap.previousMeta, swap.showPrevious, "previous", true)}
            {renderLayer(meta, visible && swap.showCurrent, "current")}
        </>
    );
};

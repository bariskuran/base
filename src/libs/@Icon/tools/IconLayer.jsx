import { LayerSvg } from "./styled";

export const IconLayer = ({
    meta,
    visible,
    fill,
    scale = 1,
    enablePulse,
    isActive,
    spinPending,
    isFlag = false,
}) => {
    if (!meta) return null;

    const { Content, viewW, viewH, opticalScale, centerX, centerY } = meta;

    const opticalTransform =
        opticalScale === 1
            ? undefined
            : `translate(${centerX} ${centerY}) scale(${opticalScale}) translate(${-centerX} ${-centerY})`;

    return (
        <LayerSvg
            $visible={visible}
            $scale={scale}
            $spin={spinPending}
            $enablePulse={enablePulse}
            $isActive={isActive}
            $fill={fill}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`0 0 ${viewW} ${viewH}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
        >
            <g transform={opticalTransform}>
                {typeof Content === "string" ? (
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
                ) : null}
            </g>
        </LayerSvg>
    );
};

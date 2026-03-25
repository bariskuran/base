import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { icons } from "./icons";
import { baseStore } from "../@baseStore";
import { flags } from "./flags";
import { Tooltip } from "../Tooltip";

const Centerized = styled.div`
    position: relative;
    display: inline-grid;
    place-items: center;
`;

export const Icon = ({
    icon,
    flag,
    width = 10,
    color,
    onHoverColor,
    style,
    useHeight = false,
    onHoverIcon,
    enableTooltip = false,
    tooltipProps = {},
    hoverManually = false,
}) => {
    const [iconsLibrary] = baseStore.useGlobal((s) => [s._iconsLibrary]);
    const allIcons = useMemo(() => ({ ...icons, ...iconsLibrary }), [iconsLibrary]);

    const [isSelfHover, setIsSelfHover] = useState(false);
    const isHover = hoverManually || isSelfHover;

    const [Content, viewW, viewH, isHorizontal, Content2, viewW2, viewH2, isHorizontal2] =
        useMemo(() => {
            const file = icon
                ? allIcons[icon] || allIcons.warning
                : flags[flag] || flags[flag?.toLowerCase()] || flags.global;

            const hoverFile = onHoverIcon
                ? allIcons[onHoverIcon] || allIcons.warning
                : flags[flag] || flags[flag?.toLowerCase()] || flags.global;

            const [viewBox, Content] = file || [];
            const [viewW, viewH] = viewBox?.split(" ").map((v) => Number(v)) || [];
            const isHorizontal = useHeight ? false : viewW > viewH;

            const [viewBox2, Content2] = hoverFile || [];
            const [viewW2, viewH2] = viewBox2?.split(" ").map((v) => Number(v)) || [];
            const isHorizontal2 = useHeight ? false : viewW2 > viewH2;

            return [Content, viewW, viewH, isHorizontal, Content2, viewW2, viewH2, isHorizontal2];
        }, [icon, flag, onHoverIcon, isHover, allIcons, useHeight]);

    const finalColor = isHover && onHoverColor ? onHoverColor : color;

    if (flag) {
        return (
            <FlagWrapper
                $size={`${width}rem`}
                $isHorizontal={isHorizontal}
                src={Content}
                alt=""
                draggable={false}
                style={style ? { ...style } : undefined}
            />
        );
    }

    return (
        <TooltipWrapper enableTooltip={enableTooltip} tooltipProps={tooltipProps}>
            <Centerized>
                <SvgW
                    {...{
                        onHoverIcon,
                        isHover,
                        finalColor,
                        width,
                        isHorizontal,
                        viewW,
                        viewH,
                        style,
                        Content,
                        setIsSelfHover,
                    }}
                />
                {onHoverIcon && (
                    <SvgW
                        {...{
                            onHoverIcon,
                            isHover,
                            isHoverIcon: true,
                            finalColor,
                            width,
                            isHorizontal: isHorizontal2,
                            viewW: viewW2,
                            viewH: viewH2,
                            style,
                            Content: Content2,
                            setIsSelfHover,
                        }}
                    />
                )}
            </Centerized>
        </TooltipWrapper>
    );
};

const SvgWrapper = styled.svg`
    ${({ $fill, theme, $isHover, $isHoverIcon, $onHoverIcon }) => css`
        grid-area: 1 / 1;
        fill: ${theme[$fill] || $fill || theme.foreground};
        user-select: none;
        display: block;
        flex-shrink: 0;
        transition:
            opacity 0.35s linear,
            transform 0.2s linear;
        opacity: ${$onHoverIcon && $isHover ? 0 : 1};
        transform: ${$onHoverIcon && $isHover ? "scale(0.9)" : "scale(1.1)"};

        ${$isHoverIcon &&
        css`
            opacity: ${$isHover ? 1 : 0};
            /* position: absolute;
            inset: 0;
            
            top: 50%;
            left: 50%; */
        `}
    `}

    ${(p) =>
        p.$isHorizontal
            ? css`
                  width: ${p.$size};
                  min-width: ${p.$size};
                  height: auto;
              `
            : css`
                  height: ${p.$size};
                  min-height: ${p.$size};
                  width: auto;
              `}
`;

const SvgW = ({
    isHover,
    isHoverIcon,
    finalColor,
    width,
    isHorizontal,
    viewW,
    viewH,
    style,
    Content,
    setIsSelfHover,
    onHoverIcon,
}) => (
    <SvgWrapper
        $fill={finalColor}
        $size={`${width}rem`}
        $isHorizontal={isHorizontal}
        $isHover={isHover}
        $isHoverIcon={isHoverIcon}
        $onHoverIcon={onHoverIcon}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={style ? { ...style } : undefined}
        onMouseEnter={() => setIsSelfHover(true)}
        onMouseLeave={() => setIsSelfHover(false)}
        aria-hidden="true"
        focusable="false"
    >
        {typeof Content === "string" ? <path d={Content} /> : Content ? <Content /> : null}
        <rect width={viewW} height={viewH} fill="transparent" />
    </SvgWrapper>
);

const TooltipWrapper = ({ enableTooltip, tooltipProps, children }) => {
    if (!enableTooltip) return children;
    return <Tooltip {...tooltipProps}>{children}</Tooltip>;
};

const FlagWrapper = styled.img`
    user-select: none;
    display: block;
    flex-shrink: 0;
    object-fit: contain;

    ${(p) =>
        p.$isHorizontal
            ? css`
                  width: ${p.$size};
                  min-width: ${p.$size};
                  height: auto;
              `
            : css`
                  height: ${p.$size};
                  min-height: ${p.$size};
                  width: auto;
              `}
`;

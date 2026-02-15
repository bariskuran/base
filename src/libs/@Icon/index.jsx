import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { icons } from "./icons";
import { baseStore } from "../@baseStore";
import { flags } from "./flags";
import { Tooltip } from "../@baseUi/Tooltip";

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
}) => {
    const [iconsLibrary] = baseStore.useGlobal((s) => [s._iconsLibrary]);
    const AllIcons = useMemo(() => ({ ...icons, ...iconsLibrary }), [icons, iconsLibrary]);
    const [isHover, setIsHover] = useState(false);

    const [Content, viewW, viewH, isHorizontal] = useMemo(() => {
        const flag2 = flag;
        const icon2 = isHover && onHoverIcon ? onHoverIcon : icon;
        const file = icon
            ? AllIcons[icon2] || icons.warning
            : flags[flag2] || flags[flag2?.toLowerCase()] || flags.global;
        const [viewBox, Content] = file;
        const [viewW, viewH] = viewBox?.split(" ").map((v) => Number(v)) || [];
        const isHorizontal = useHeight ? false : viewW > viewH;
        return [Content, viewW, viewH, isHorizontal];
    }, [icon, flag, onHoverIcon, isHover]);

    /* */
    if (flag)
        return <FlagWrapper src={Content} width={width} style={style && { ...style }} alt="" />;
    return (
        <TooltipWrapper enableTooltip={enableTooltip} tooltipProps={tooltipProps}>
            <SvgWrapper
                $fill={isHover && onHoverColor ? onHoverColor : color}
                $size={width + "rem"}
                $isHorizontal={isHorizontal}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox={`0 0 ${viewW} ${viewH}`}
                style={style && { ...style }}
                onMouseOver={() => setIsHover(true)}
                onMouseOut={() => setIsHover()}
            >
                {typeof Content === "string" ? <path d={Content} /> : <Content />}
                <rect style={{ fill: "rgba(0,0,0,0)" }} width={viewW} height={viewH} />
            </SvgWrapper>
        </TooltipWrapper>
    );
};

const TooltipWrapper = ({ enableTooltip, tooltipProps, children }) => {
    /* */
    if (!enableTooltip) return children;
    return <Tooltip {...tooltipProps}>{children}</Tooltip>;
};

const SvgWrapper = styled.svg`
    fill: ${({ $fill, theme }) => theme[$fill] || theme.foreground};
    pointer-events: none;

    ${(p) =>
        p.$isHorizontal
            ? css`
                  width: ${p.$size};
                  min-width: ${p.$size};
              `
            : css`
                  height: ${p.$size};
                  min-height: ${p.$size};
              `}
`;

const FlagWrapper = styled.img`
    pointer-events: none;
    ${(p) => {
        if (p.$isHorizontal)
            return css`
                width: ${p.$size};
                fill: ${p.$fill};
            `;
        return css`
            height: ${p.$size};
            fill: ${p.$fill};
        `;
    }}
`;

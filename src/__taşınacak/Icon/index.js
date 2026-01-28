import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { icons } from "./icons";

export const Icon = ({ icon, width = 10, color, onHoverColor, style, useHeight = false, onClick, onHoverIcon }) => {
    const [isHover, setIsHover] = useState(false);

    const [Content, viewW, viewH, isHorizontal] = useMemo(() => {
        const icon2 = isHover && onHoverIcon ? onHoverIcon : icon;
        const file = icons[icon2] || icons.warning;
        const [viewBox, Content] = file;
        const [viewW, viewH] = viewBox?.split(" ").map((v) => Number(v)) || [];
        const isHorizontal = useHeight ? false : viewW > viewH;
        return [Content, viewW, viewH, isHorizontal];
    }, [icon, onHoverIcon, isHover]);

    /* */
    return (
        <SvgWrapper
            $fill={isHover && onHoverColor ? onHoverColor : color}
            $size={width + "rem"}
            $isHorizontal={isHorizontal}
            $clickable={onClick}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`0 0 ${viewW} ${viewH}`}
            style={style && { ...style }}
            onClick={(e) => {
                e?.preventDefault?.();
                onClick && onClick(e);
            }}
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover()}
        >
            {typeof Content === "string" ? <path d={Content} /> : <Content />}
            <rect style={{ fill: "rgba(0,0,0,0)" }} width={viewW} height={viewH} />
        </SvgWrapper>
    );
};

const SvgWrapper = styled.svg`
    fill: ${({ $fill, theme }) => theme[$fill] || theme.foreground};

    cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
    pointer-events: ${({ $clickable }) => ($clickable ? "all" : "none")};

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

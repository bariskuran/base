import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { icons } from "./icons";
import { baseStore } from "../@baseStore";

export const Icon = ({ icon, width = 10, color, onHoverColor, style, useHeight = false }) => {
    const [iconsLibrary] = baseStore.useGlobal((s) => [s._iconsLibrary]);
    const AllIcons = useMemo(() => ({ ...icons, ...iconsLibrary }), [icons, iconsLibrary]);
    const [isHover, setIsHover] = useState(false);

    const [Content, viewW, viewH, isHorizontal] = useMemo(() => {
        const file = AllIcons[icon] || icons.warning;
        const [viewBox, Content] = file;
        const [viewW, viewH] = viewBox?.split(" ").map((v) => Number(v)) || [];
        const isHorizontal = useHeight ? false : viewW > viewH;
        return [Content, viewW, viewH, isHorizontal];
    }, [icon, isHover, AllIcons]);

    /* */
    return (
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
    );
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

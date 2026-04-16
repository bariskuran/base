import { useMemo, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { icons } from "./icons";
import { baseStore } from "../@baseStore";
import { PopTip } from "../PopTip";

const Centerized = styled.div`
    position: relative;
    display: inline-grid;
    place-items: center;
`;

const isValidIconArray = (value) => {
    if (!Array.isArray(value)) return false;
    if (value.length < 2) return false;

    const [viewBox, content] = value;

    const isValidViewBox =
        typeof viewBox === "string" &&
        viewBox.trim().split(/\s+/).length === 2 &&
        viewBox
            .trim()
            .split(/\s+/)
            .every((v) => !Number.isNaN(Number(v)));

    const isValidContent =
        typeof content === "string" || typeof content === "function" || content != null;

    return isValidViewBox && isValidContent;
};

const resolveIconFile = (iconInput, allIcons) => {
    if (typeof iconInput === "string") {
        return allIcons[iconInput] || null;
    }

    if (isValidIconArray(iconInput)) {
        return iconInput;
    }

    return null;
};

export const Icon = ({
    icon,
    color,
    width = 10,
    style,
    useHeight = false,
    onHoverIcon: onHoverIconProp,
    onHoverColor,
    onHoverIconWidth,
    onHoverStyle,
    onActiveIcon: onActiveIconProp,
    onActiveColor,
    onActiveIconWidth,
    onActiveStyle,
    enablePopTip = false,
    popTipProps = {},
    hoverManually = false,
    isActive = false,
}) => {
    const [iconsLibrary] = baseStore.useGlobal((s) => [s._iconsLibrary]);
    const allIcons = useMemo(() => ({ ...icons, ...iconsLibrary }), [iconsLibrary]);

    const [isSelfHover, setIsSelfHover] = useState(false);
    const onActiveIcon = onActiveIconProp || icon;
    const onHoverIcon = onHoverIconProp || icon;
    const isHover = (hoverManually || isSelfHover) && !isActive;

    const [
        Content,
        viewW,
        viewH,
        isHorizontal,
        Content2,
        viewW2,
        viewH2,
        isHorizontal2,
        Content3,
        viewW3,
        viewH3,
        isHorizontal3,
    ] = useMemo(() => {
        const file = resolveIconFile(icon, allIcons);
        const hoverFile = resolveIconFile(onHoverIcon, allIcons);
        const activeFile = resolveIconFile(onActiveIcon, allIcons);

        if (!file) {
            return [null, 0, 0, true, null, 0, 0, true, null, 0, 0, true];
        }

        const [viewBox, Content] = file || [];
        const [viewW, viewH] = viewBox?.split(/\s+/).map((v) => Number(v)) || [];
        const isHorizontal = useHeight ? false : viewW > viewH;

        const [viewBox2, Content2] = hoverFile || file || [];
        const [viewW2, viewH2] = viewBox2?.split(/\s+/).map((v) => Number(v)) || [];
        const isHorizontal2 = useHeight ? false : viewW2 > viewH2;

        const [viewBox3, Content3] = activeFile || file || [];
        const [viewW3, viewH3] = viewBox3?.split(/\s+/).map((v) => Number(v)) || [];
        const isHorizontal3 = useHeight ? false : viewW3 > viewH3;

        return [
            Content,
            viewW,
            viewH,
            isHorizontal,
            Content2,
            viewW2,
            viewH2,
            isHorizontal2,
            Content3,
            viewW3,
            viewH3,
            isHorizontal3,
        ];
    }, [icon, onHoverIcon, allIcons, useHeight, onActiveIcon]);

    const finalColor =
        isActive && onActiveColor ? onActiveColor : isHover && onHoverColor ? onHoverColor : color;

    const finalWidth =
        isActive && onActiveIconWidth
            ? onActiveIconWidth
            : isHover && onHoverIconWidth
              ? onHoverIconWidth
              : width;

    if (!Content || !viewW || !viewH) return null;

    return (
        <PopTipWrapper enablePopTip={enablePopTip} popTipProps={popTipProps}>
            <Centerized>
                <SvgW
                    {...{
                        onHoverIcon,
                        isHover,
                        finalColor,
                        width: finalWidth,
                        isHorizontal,
                        viewW,
                        viewH,
                        style,
                        Content,
                        setIsSelfHover,
                        isActive,
                        onActiveIcon,
                    }}
                    enable={!isHover && !isActive}
                />
                {onHoverIcon && (
                    <SvgW
                        {...{
                            onHoverIcon,
                            isHover,
                            isHoverIcon: true,
                            finalColor,
                            width: finalWidth,
                            isHorizontal: isHorizontal2,
                            viewW: viewW2,
                            viewH: viewH2,
                            style: onHoverStyle || style,
                            Content: Content2,
                            setIsSelfHover,
                            isActive,
                            onActiveIcon,
                        }}
                        enable={isHover && !isActive}
                    />
                )}
                {onActiveIcon && (
                    <SvgW
                        {...{
                            finalColor,
                            width: finalWidth,
                            isHorizontal: isHorizontal3,
                            viewW: viewW3,
                            viewH: viewH3,
                            style: onActiveStyle || style,
                            Content: Content3,
                            setIsSelfHover,
                            isActive,
                            onActiveIcon,
                        }}
                        enable={isActive && !isHover}
                    />
                )}
            </Centerized>
        </PopTipWrapper>
    );
};

const pulseTwice = keyframes`
    0% {
        transform: scale(0.9);
    }
    20% {
        transform: scale(1.5);
    }
    40% {
        transform: scale(0.9);
    }
    60% {
        transform: scale(1.5);
    }
    80%,
    100% {
        transform: scale(0.9);
    }
`;

const SvgWrapper = styled.svg`
    ${({ $fill, theme, $isHover, $onHoverIcon, $isActive, $enable }) => css`
        grid-area: 1 / 1;
        fill: ${theme[$fill] || $fill || theme.foreground};
        user-select: none;
        display: block;
        flex-shrink: 0;
        transition:
            opacity 0.35s linear,
            transform 0.2s linear;
        opacity: ${$enable ? 1 : 0};

        ${$onHoverIcon &&
        $isHover &&
        css`
            transform: scale(1.1);
        `}

        ${$enable &&
        $isActive &&
        css`
            animation: ${pulseTwice} 1.5s ease forwards;
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
    isActive,
    onActiveIcon,
    enable,
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
        $isActive={isActive}
        $onActiveIcon={onActiveIcon}
        $enable={enable}
    >
        {typeof Content === "string" ? <path d={Content} /> : Content ? <Content /> : null}
        <rect width={viewW} height={viewH} fill="transparent" />
    </SvgWrapper>
);

const PopTipWrapper = ({ enablePopTip, popTipProps, children }) => {
    if (!enablePopTip) return children;
    return <PopTip {...popTipProps}>{children}</PopTip>;
};

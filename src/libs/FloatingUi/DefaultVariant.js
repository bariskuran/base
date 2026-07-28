import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({
        theme,
        $bgColor,
        $color,
        $positionX,
        $positionY,
        $alignX,
        $alignY,
        $arrowOffset,
        $blockVisibility,
        $disableArrow,
        $colors,
        $status,
        $delayMs,
        $floatingPadding,
        $maxWidth,
    }) => {
        const translateY = $alignY === "bottom" ? "-8rem" : "8rem";
        const isOpen = $status === "opened";
        const hasArrowOffset = $arrowOffset != null && Number.isFinite($arrowOffset);

        /* Return */
        return css`
            all: unset;
            display: block;
            box-sizing: border-box;
            width: max-content;
            max-width: ${$maxWidth != null ? $maxWidth : "calc(100vw - 40rem)"};

            @starting-style {
                opacity: 0;
                transform: translateY(${translateY});
            }
            opacity: ${isOpen ? 1 : 0};
            transform: ${isOpen ? "translateY(0)" : `translateY(${translateY})`};
            transition:
                opacity ${$delayMs}ms ease,
                transform ${$delayMs}ms ease;
            will-change: opacity, transform;

            ${$blockVisibility &&
            css`
                opacity: 0;
            `}

            position: absolute;
            top: ${$positionY ?? 150}px;
            left: ${$positionX ?? 150}px;
            pointer-events: auto;
            z-index: 1000;
            background-color: ${$bgColor
                ? $colors.color
                : $colors.colorApi.isLight
                  ? $colors.colorApi.shade5
                  : $colors.colorApi.tint5};
            color: ${$color || $colors.opposite};
            word-wrap: break-word;
            overflow-wrap: break-word;
            padding: ${$floatingPadding != null ? $floatingPadding : "10rem"};
            border-radius: 5rem;
            filter: drop-shadow(1px 1px 4rem ${theme.colorAlpha(theme.foreground, 0.5)});

            ${$disableArrow &&
            css`
                &::before {
                    display: none;
                }
            `}

            &::before {
                content: "";
                position: absolute;
                width: 18rem;
                height: 10rem;

                background-color: ${$bgColor
                    ? $colors.color
                    : $colors.colorApi.isLight
                      ? $colors.colorApi.shade5
                      : $colors.colorApi.tint5};

                clip-path: polygon(50% 100%, 0 0, 100% 0);
                filter: drop-shadow(1px 1px 4rem ${theme.colorAlpha(theme.foreground, 0.35)});

                ${hasArrowOffset
                    ? css`
                          left: ${$arrowOffset}px;
                          transform: translateX(-50%);
                      `
                    : css`
                          ${$alignX === "left" &&
                          css`
                              left: 8rem;
                          `}

                          ${$alignX === "right" &&
                          css`
                              right: 8rem;
                          `}

                          ${$alignX === "center" &&
                          css`
                              left: 50%;
                              transform: translateX(-50%);
                          `}
                      `}

                ${$alignY === "top" &&
                css`
                    bottom: -9rem;
                `}

                ${$alignY === "bottom" &&
                css`
                    top: -9rem;
                    transform: ${hasArrowOffset || $alignX === "center"
                        ? "translateX(-50%) rotate(180deg)"
                        : "rotate(180deg)"};
                `}
            }
        `;
    }}
`;

import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({
        theme,
        // $direction, // "x" OR "y"
        // $align, // top, bottom, left, right
        $position, // horizontal, vertical
        $truckColor,
        // $thumbColor,
        // $colors,
        // $thumbLength,
        // $thumbPosition,
        // $maxScroll,
        // $scrollPos,
        // $isDragging,
        // $isBoxMode,
        $isScrollbarActive,
    }) => {
        const mainColor = $truckColor ? theme[$truckColor] || $truckColor : theme.foreground;

        return css`
            background-color: ${theme.colorAlpha(mainColor, 0.5)};
            transition:
                background-color 1s,
                opacity 1s;
            opacity: ${$isScrollbarActive ? 0.5 : 0.2};
            scale: ${$position === "horizontal" ? "1 0.7" : "0.7 1"};

            & > [data-slot="thumb"] {
                border-radius: 5rem;
                transition: background-color 1s;
                background-color: ${mainColor};
                scale: ${$position === "horizontal" ? "1 1.5" : "1.5 1"};
            }
        `;
    }}
`;

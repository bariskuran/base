import styled, { css } from "styled-components";

const S = styled.div`
    ${({
        theme,
        $barPosition,
        $isOppositePosition,
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
        const mainColor = $truckColor ? theme[$truckColor] || $truckColor : theme.primary;

        return css`
            background-color: ${theme.colorAlpha(mainColor, 0.5)};
            transition:
                background-color 0.5s,
                opacity 0.5s;
            opacity: ${$isScrollbarActive ? 1 : 0.3};

            & > [data-slot="thumb"] {
                border-radius: 5rem 0 0 5rem;
                transition:
                    background-color 0.5s,
                    scale 0.5s;
                background-color: ${mainColor};
                scale: ${$barPosition === "horizontal"
                    ? $isScrollbarActive
                        ? "1 2"
                        : "1 1.5"
                    : $isScrollbarActive
                      ? "2 1"
                      : "1.5 1"};
                transform-origin: ${$barPosition === "horizontal"
                    ? $isOppositePosition
                        ? "left center"
                        : "right center"
                    : $isOppositePosition
                      ? "left center"
                      : "right center"};
            }
        `;
    }}
`;

export const X = {
    variant: S,
    truckColor: "primary",
    thumbColor: "primary",
};
export default X;

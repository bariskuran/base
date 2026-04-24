import styled, { css } from "styled-components";

const S = styled.div`
    ${({
        theme,
        $barPosition,
        // $isOppositePosition,
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
                border-radius: 2rem;
                transition:
                    background-color 0.5s,
                    scale 0.5s;
                background-color: ${mainColor};
                scale: ${$barPosition === "horizontal"
                    ? $isScrollbarActive
                        ? "1 1.2"
                        : "1 1"
                    : $isScrollbarActive
                      ? "1.2 1"
                      : "1 1"};
            }
        `;
    }}
`;

export const X = {
    variant: S,
    truckColor: "primary",
    thumbColor: "primary",
    body: true,
    edgeMargin: 10,
};
export default X;

import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({
        theme,
        // $direction, // "x" OR "y"
        // $align, // top, bottom, left, right
        // $position, // horizontal, vertical
        $truckColor,
        $thumbColor,
        // $colors,
        // $thumbLength,
        // $thumbPosition,
        // $maxScroll,
        // $scrollPos,
    }) => css`
        background-color: ${$truckColor || theme.colorAlpha(theme.primary, 0.2)};
        border-radius: 5rem;

        & > [data-slot="thumb"] {
            border-radius: 5rem;
            background-color: ${$thumbColor || theme.primary};
        }
    `}
`;

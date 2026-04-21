import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({ theme, $barPosition, $truckColor, $thumbColor, $isScrollbarActive }) => {
        const mainColor = $truckColor ? theme[$truckColor] || $truckColor : theme.foreground;
        const thumbMainColor = $thumbColor ? theme[$thumbColor] || $thumbColor : mainColor;

        return css`
            background-color: ${theme.colorAlpha(mainColor, 0.5)};
            transition:
                background-color 1s,
                opacity 1s;
            opacity: ${$isScrollbarActive ? 0.5 : 0.2};
            scale: ${$barPosition === "horizontal" ? "1 0.5" : "0.5 1"};

            & > [data-slot="thumb"] {
                border-radius: 5rem;
                transition: background-color 1s;
                background-color: ${thumbMainColor};
            }
        `;
    }}
`;

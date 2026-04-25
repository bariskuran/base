import styled, { css } from "styled-components";

const S = styled.div`
    ${({ theme, $truckColor, $isScrollbarActive, $barPosition }) => {
        const mainColor = $truckColor ? theme[$truckColor] || $truckColor : theme.primary;
        return css`
            background-color: ${theme.colorAlpha(mainColor, 0.5)};
            transition:
                background-color 0.5s,
                opacity 0.5s;
            opacity: ${$isScrollbarActive ? 1 : 0.3};
            /* scale: ${$barPosition === "horizontal" ? "1.5 1" : "1 1.5"}; */

            & > [data-slot="thumb"] {
                border-radius: 2rem;
                transition:
                    background-color 0.5s,
                    scale 0.5s;
                background-color: ${mainColor};
                transform-origin: center;
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

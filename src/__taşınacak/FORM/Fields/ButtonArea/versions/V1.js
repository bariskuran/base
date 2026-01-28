import styled, { css } from "styled-components";

export const V1 = styled.div`
    ${({
        $align = "center",
        $justify = "flex-end",
        $gap = 10,
        $margin = 10,
        $direction = "row",
        $width = "100%",
        theme,
    }) => css`
        display: flex;
        width: ${$width};
        flex-direction: ${$direction};
        justify-content: ${$justify};
        align-items: ${$align};
        gap: ${$gap}rem;
        margin: ${$margin}rem 0;
        user-select: none;

        & > a,
        & > button,
        & > div {
            user-select: none;
        }

        ${theme.media(
            "phone,tablet",
            css`
                flex-direction: column;
            `,
        )}
    `}
`;

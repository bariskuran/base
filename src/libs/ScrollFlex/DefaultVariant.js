import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({ theme, $borderColor }) => {
        const colors = theme.colorGet($borderColor || theme.background);

        return css`
            box-sizing: border-box;
            position: relative;
            width: 100%;
            max-width: 100%;
            min-width: 0;
            min-height: 0;
            border: 1px solid ${theme.colorAlpha(colors.opposite, 0.2)};
        `;
    }}
`;

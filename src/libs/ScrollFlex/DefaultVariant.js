import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({ theme, $borderColor }) => {
        const colors = theme.colorGet($borderColor || theme.background);

        return css`
            border: 1px solid ${theme.colorAlpha(colors.opposite, 0.2)};
        `;
    }}
`;

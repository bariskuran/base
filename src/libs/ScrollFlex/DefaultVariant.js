import styled, { css } from "styled-components";
import { Flex } from "../Flex";

// export const DefaultVariant = styled.div`
export const DefaultVariant = styled(Flex)`
    ${({ theme, $borderColor }) => {
        const colors = theme.colorGet($borderColor || theme.background);

        return css`
            border: 1px solid ${theme.colorAlpha(colors.opposite, 0.2)};
        `;
    }}
`;

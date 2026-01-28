import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    ${({ defaultGlobalStyle }) => defaultGlobalStyle}
    ${({ globalStyle }) => globalStyle}
`;

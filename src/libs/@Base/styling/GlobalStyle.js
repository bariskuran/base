import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    ${({ fontImports }) => fontImports}
    ${({ defaultGlobalStyle }) => defaultGlobalStyle}
    ${({ globalStyle }) => globalStyle}
`;

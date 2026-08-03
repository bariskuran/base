import { createGlobalStyle } from "styled-components";

/** Do not interpolate @import here — it breaks production CSSOM injection for component rules. */
export const GlobalStyle = createGlobalStyle`
    ${({ defaultGlobalStyle }) => defaultGlobalStyle}
    ${({ globalStyle }) => globalStyle}
`;

import styled from "styled-components";
import { Flex } from "../../Flex";

const shellShouldForward = (prop) =>
    !["$gutterTop", "$gutterRight", "$gutterBottom", "$gutterLeft", "$intrinsicHeight"].includes(
        prop,
    );

export const S = {
    shell: styled.div.withConfig({ shouldForwardProp: shellShouldForward })`
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-height: 0;
        min-width: 0;
        width: 100%;
        max-width: 100%;
        height: 100%;
        flex: 1 1 auto;
        overflow-x: ${(p) => (p.$intrinsicHeight ? "hidden" : "visible")};
        overflow-y: ${(p) => (p.$intrinsicHeight ? "auto" : "visible")};
        padding-top: ${(p) => p.$gutterTop};
        padding-right: ${(p) => p.$gutterRight};
        padding-bottom: ${(p) => p.$gutterBottom};
        padding-left: ${(p) => p.$gutterLeft};
    `,
    content: styled(Flex)`
        position: relative;
        box-sizing: border-box;
        flex: 1 1 auto;
        min-height: 0;
        min-width: 0;
        width: auto;
        max-width: 100%;
    `,
};

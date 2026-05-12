import styled from "styled-components";
import { Flex } from "../../Flex";

const shellShouldForward = (prop) =>
    !["$gutterTop", "$gutterRight", "$gutterBottom", "$gutterLeft"].includes(prop);

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
        overflow-x: hidden;
        overflow-y: auto;
        padding-top: ${(p) => p.$gutterTop};
        padding-right: ${(p) => p.$gutterRight};
        padding-bottom: ${(p) => p.$gutterBottom};
        padding-left: ${(p) => p.$gutterLeft};
    `,
    content: styled(Flex)`
        position: relative;
        box-sizing: border-box;
        /* Shell scrolls; this block must not flex-shrink or bottom padding is clipped. */
        flex: 0 0 auto;
        align-self: stretch;
        min-height: 0;
        min-width: 0;
        width: auto;
        max-width: 100%;
    `,
};

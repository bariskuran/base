import styled from "styled-components";
import { Flex } from "../../Flex";

export const S = {
    shell: styled.div`
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-height: 0;
        min-width: 0;
        flex: 1 1 auto;
        overflow-x: hidden;
        overflow-y: hidden;
    `,
    content: styled(Flex)`
        position: relative;
        box-sizing: border-box;
        flex: 0 0 auto;
        align-self: stretch;
        min-height: 0;
        min-width: 0;
        width: auto;
        max-width: 100%;
    `,
};

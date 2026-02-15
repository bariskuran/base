import styled, { css } from "styled-components";
import { Tooltip as AntdTooltip } from "antd";
import { componentCreator } from "../componentCreator/index.jsx";

const def = styled(AntdTooltip)`
    ${({ theme }) => css`
        .ant-tooltip-inner {
            background: green !important;
        }
    `}
`;

const variants = {
    v1: styled(def)`
        ${({ theme }) => css``}
    `,
    v2: styled(def)`
        ${({ theme }) => css``}
    `,
};

export const Tooltip = componentCreator("Tooltip", def, variants);

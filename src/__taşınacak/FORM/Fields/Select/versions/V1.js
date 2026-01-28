import styled, { css } from "styled-components";
import { Select } from "antd";

export const V1 = styled(Select)`
    ${({ enableAbsoluteLabel }) => {
        return css`
            height: 100%;
            min-height: 40rem;
            position: relative;
            padding: 0 30rem;

            .ant-select-selection-placeholder {
                display: none !important;
            }

            .ant-select-selection-search > input {
                cursor: pointer !important;
            }

            .ant-select-selector {
                border: none !important;
                border-radius: 0;
                background: transparent !important;
                height: 100% !important;
                min-height: 40rem;
                outline: none !important;
                border: none !important;
                box-shadow: none !important;
                cursor: pointer;
                font-size: 13rem !important;
            }

            .ant-select-selection-item {
                text-align: left;
                top: ${enableAbsoluteLabel ? 5 : 0}rem;
            }
        `;
    }}
`;

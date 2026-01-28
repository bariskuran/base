import styled, { css } from "styled-components";
import { Select } from "antd";

export const V2 = styled(Select)`
    ${({ theme, enableAbsoluteLabel }) => {
        return css`
            height: 100%;
            min-height: 40rem;
            position: relative;
            padding: 0 30rem;

            .ant-select-selector {
                border: none !important;
                border-radius: 0;
                background: transparent !important;
                height: 100% !important;
                min-height: 40rem;
                cursor: pointer !important;
                outline: none !important;
                border: none !important;
                box-shadow: none !important;
                padding-left: 0 !important;
                font-size: 12rem !important;
            }

            .ant-select-arrow {
                font-size: 20rem;
            }

            .ant-select-selection-search > input {
                cursor: pointer !important;
            }

            .ant-select-selection-item {
                text-align: left;
                top: ${enableAbsoluteLabel ? 5 : 0}rem;
            }

            .ant-select-selection-placeholder {
                min-height: 40rem;
                display: flex !important;
                align-items: center;
                color: ${theme.grey};
                font-size: 13rem;
                opacity: 0.5;
                text-align: left;
            }
        `;
    }}
`;

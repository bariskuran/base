import styled from "styled-components";
import { InputNumber as InputNumberOrj } from "antd";

export const V1 = styled(InputNumberOrj)`
    position: relative;
    background: transparent !important;
    border: none;
    border-radius: 0;
    width: 100%;
    height: 100%;
    min-height: 40rem;
    padding: 0 10rem;
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    cursor: pointer;

    &:hover,
    &:focus {
        background: transparent !important;
    }

    & > .ant-input-number-handler-wrap {
        width: 35rem !important;
        z-index: 2;
        opacity: 1;
        background: transparent !important;

        & > span > span > svg {
            transform: scale(2, 1);
        }
    }
    & > .ant-input-number-input-wrap {
        width: calc(100% - 50rem);
        z-index: 1;
        height: 100%;

        & > input {
            height: 100%;
            min-height: 40rem;
        }
    }
`;

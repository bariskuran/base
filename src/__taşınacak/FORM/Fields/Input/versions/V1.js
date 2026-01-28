import styled from "styled-components";
import { Input as InputOrj } from "antd";

export const V1 = styled(InputOrj)`
    position: relative;
    background: transparent !important;
    border: none;
    border-radius: 0;
    width: 100%;
    height: 100%;
    padding: 0 30rem;
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    cursor: pointer;
    font-size: 13rem !important;

    &:hover,
    &:focus {
        background: transparent !important;
        background: transparent;
        outline: none !important;
        border: none !important;

        & > .ant-input-suffix {
            & > .ant-input-clear-icon {
                opacity: 0.5;
            }
        }
    }

    & > .ant-input-prefix {
        margin-right: 10rem;
    }

    & > .ant-input-suffix {
        & > .ant-input-clear-icon {
            line-height: 0;
            opacity: 0;
            transition: all 0.25s ease-in-out;
        }
        /* & > .ant-input-show-count-suffix {
        }
        & > .ant-input-show-count-ant-input-clear-icon {
        } */
    }
`;

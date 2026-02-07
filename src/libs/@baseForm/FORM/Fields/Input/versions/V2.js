import styled from "styled-components";
import { Input as InputOrj } from "antd";

export const V2 = styled(InputOrj)`
    position: relative;
    background: transparent !important;
    border: none;
    border-radius: 0;
    width: 100%;
    height: 100%;
    min-height: 40rem;
    padding: 0;
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    font-size: 12rem !important;

    &::placeholder {
        color: ${({ theme }) => theme.grey};
    }

    &:hover,
    &:focus {
        background: transparent !important;

        & > .ant-input-suffix {
            & > .ant-input-clear-icon {
                opacity: 0.5;
            }
        }
    }

    &::placeholder {
        font-size: 13rem;
        opacity: 0.5;
    }

    & > .ant-input-prefix {
        margin-right: 10rem;
    }
    & > .ant-input {
        min-height: 60rem;
        cursor: pointer;

        &:hover,
        &:focus {
            background: transparent;
            outline: none !important;
            border: none !important;
        }
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

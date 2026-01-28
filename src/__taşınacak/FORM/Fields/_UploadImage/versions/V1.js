import styled, { css } from "styled-components";

export const V1 = styled.div`
    ${({ $showList }) => css`
        width: 100%;
        height: 100%;
        min-height: 60rem;
        position: relative;
        padding: 0 10rem;

        & > .ant-upload-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;

            & > .ant-upload {
                width: 100%;
                height: 100%;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                border: none;
                border-radius: 0;
                background: transparent;

                & > .ant-upload-btn > .ant-upload-drag-container > #addArea {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20rem;
                }
            }

            & > .ant-upload-list {
                display: flex;
                flex-wrap: wrap;
            }
        }

        ${$showList
            ? css`
                  & > .ant-upload-wrapper > .ant-upload {
                      width: 0%;
                      height: 0%;
                  }
              `
            : css`
                  & > .ant-upload-wrapper > .ant-upload-list {
                      display: none;
                  }
              `}
    `}
`;

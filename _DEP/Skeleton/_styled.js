import styled, { css, keyframes } from "styled-components";
import { Skeleton as AntSkeleton2 } from "antd";

const shine = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export const Container = styled.div`
    ${({ theme, $show, $height }) => {
        return $show && $height > 0
            ? css`
                  position: absolute;
                  width: 100%;
                  height: ${$height}px;
                  min-width: 100%;
                  min-height: 100%;
                  top: 0;
                  left: 0;
                  z-index: 200;
                  background: ${theme.background};
                  background-image: linear-gradient(
                      142deg,
                      ${theme.colorAlpha(theme.greyB7, 20)} 40%,
                      ${theme.colorAlpha(theme.greyB2, 30)} 50%,
                      ${theme.colorAlpha(theme.greyB7, 20)} 60%
                  );
                  background-size: 200% 100%;
                  animation: ${shine} 3s infinite linear;
                  padding: 20rem;
              `
            : css`
                  display: none;
              `;
    }}
`;

export const AntSkeleton = styled(AntSkeleton2)`
    display: absolute;
    top: 0;
    left: 0;
`;

export const FormShapeContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    gap: 20rem;

    & > div:nth-child(1) {
        flex: 0 0 50rem;
        background: ${({ theme }) => theme.colorAlpha(theme.greyB5, 20)};
    }
    & > div:nth-child(2) {
        flex: 1 1 auto;
        background: ${({ theme }) => theme.colorAlpha(theme.greyB5, 20)};
    }
    & > div:nth-child(3) {
        flex: 0 0 50rem;
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        & > div {
            flex: 0 0 40%;
            background: ${({ theme }) => theme.colorAlpha(theme.greyB5, 20)};
        }
    }
`;

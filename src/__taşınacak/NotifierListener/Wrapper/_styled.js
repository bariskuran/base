import styled, { keyframes } from "styled-components";

const fromBottom = keyframes`
  0% {
    top:20rem;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    top:0rem;
    opacity:1;
  }
`;
const fromTop = keyframes`
  0% {
    bottom:20rem;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    bottom:0rem;
    opacity:1;
  }
`;
const fromLeft = keyframes`
  0% {
    right:20rem;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    right:0rem;
    opacity:1;
  }
`;
const fromRight = keyframes`
  0% {
    left:20rem;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left:0rem;
    opacity:1;
  }
`;

const Styled = {
    container: styled.div`
        z-index: 1001;
        opacity: 0;
        width: fit-content;
        animation-duration: 500ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
        animation-name: ${(p) =>
            p?.$placement?.[1] === "center" && p?.$placement?.[0] === "top"
                ? fromTop
                : p?.$placement?.[1] === "center" && p?.$placement?.[0] === "bottom"
                  ? fromBottom
                  : p?.$placement?.[1] === "left"
                    ? fromLeft
                    : p?.$placement?.[1] === "right"
                      ? fromRight
                      : null};
    `,
};
export default Styled;

import { styled } from "styled-components";
import { getImageLoadingAnimation } from "./animations";

const cssSize = (value) => (typeof value === "number" ? `${value}px` : value);

export const S = {
    wrapper: styled.span`
        position: relative;
        display: inline-block;
        width: ${({ $width }) => cssSize($width)};
        height: ${({ $height }) => cssSize($height)};
        max-width: 100%;
        overflow: hidden;
        vertical-align: middle;
        background: ${({ $showPlaceholder }) =>
            $showPlaceholder ? "linear-gradient(90deg, #eeeeee, #f7f7f7, #eeeeee)" : "transparent"};
        animation: ${({ $showPlaceholder, $loadingAnimation }) =>
            $showPlaceholder ? getImageLoadingAnimation($loadingAnimation) : "none"};
        aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || "auto"};
    `,
    img: styled.img`
        display: block;
        width: 100%;
        height: ${({ $heightAuto }) => ($heightAuto ? "auto" : "100%")};
        object-fit: ${({ $objectFit }) => $objectFit || "cover"};
        opacity: ${({ $loaded, $showingPreview }) => ($loaded || $showingPreview ? 1 : 0)};
        transition: opacity 220ms ease;
    `,
};

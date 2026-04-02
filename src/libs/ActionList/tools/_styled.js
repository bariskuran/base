import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${({ $direction, $gap, $colors, $disableBoxShadow, $disableHover }) => css`
            all: unset;
            display: flex;
            flex-direction: ${$direction};
            gap: ${$gap + "rem"};
            background: ${$colors.color};
            color: ${$colors.opposite};
            padding: 5rem;
            padding-right: 15rem;
            transition: all 0.3s ease;
            box-shadow: ${$disableBoxShadow ? "none" : "2rem 2rem 5rem 2rem rgba(0, 0, 0, 0.2)"};

            ${!$disableHover &&
            css`
                &:hover {
                    background: ${$colors.colorApi.isLight
                        ? $colors.colorApi.shade10
                        : $colors.colorApi.tint10};
                }
            `}
        `}
    `,
};
export default S;

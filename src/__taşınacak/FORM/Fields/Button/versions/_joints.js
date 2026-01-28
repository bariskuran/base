import { css, keyframes } from "styled-components";

export const colorManager = ({ theme, primary, secondary, error, success }) => {
    if (primary) return [theme.primary, theme.primaryF2, theme.primaryF2];
    if (secondary) return [theme.secondary, theme.secondaryF2, theme.secondaryB7];
    if (error) return [theme.error, theme.errorF2, theme.errorB7];
    if (success) return [theme.success, theme.successF2, theme.successB7];
    return [theme.greyB5, theme.greyB2, theme.greyB9];
};

export const joints = {
    transition150linear: css`
        transition: all 150ms linear;
    `,
    transition250linear: css`
        transition: all 250ms linear;
    `,
    transition500linear: css`
        transition: all 500ms linear;
    `,
    transition250ease: css`
        transition: all 250ms ease-in-out;
    `,
    transition500ease: css`
        transition: all 250ms ease-in-out;
    `,
    animation1: keyframes`
        0%, 50%, 100% {
            margin-left:0rem;
        }
        25% {
            margin-left:-8rem;
        }
        75% {
            margin-left:8rem;
        }`,
    animation2: keyframes`
        0%, 50%, 100% {
            margin-right:0rem;
        }
        25% {
            margin-right:-8rem;
        }
        75% {
            margin-right:8rem;
        }`,
    animation3: keyframes`
        0%, 50%, 100% {
            margin-top:0rem;
        }
        25% {
            margin-top:-8rem;
        }
        75% {
            margin-top:8rem;
        }`,
    boxShadow1: css`
        box-shadow: 0 5rem 5rem 0rem rgba(0, 0, 0, 0.2);
    `,
};

export const transition = css`
    transition: all 150ms linear;
`;

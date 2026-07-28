import styled from "styled-components";

const resolveTransform = (direction, distance) => {
    const transforms = {
        top: `translate3d(0, -${distance}rem, 0)`,
        right: `translate3d(${distance}rem, 0, 0)`,
        bottom: `translate3d(0, ${distance}rem, 0)`,
        left: `translate3d(-${distance}rem, 0, 0)`,
    };

    return transforms[direction] || transforms.bottom;
};

const S = {
    container: styled.div`
        min-width: 0;
        opacity: ${({ $visible }) => ($visible ? 1 : 0)};
        transform: ${({ $visible, $direction, $distance }) =>
            $visible ? "translate3d(0, 0, 0)" : resolveTransform($direction, $distance)};
        transition:
            opacity ${({ $animationMs }) => $animationMs}ms cubic-bezier(0.22, 1, 0.36, 1),
            transform ${({ $animationMs }) => $animationMs}ms cubic-bezier(0.22, 1, 0.36, 1);
        will-change: opacity, transform;

        @media (prefers-reduced-motion: reduce) {
            opacity: 1;
            transform: none;
            transition: none;
        }
    `,
};

export default S;

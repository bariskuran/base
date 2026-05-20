import styled from "styled-components";

const Root = styled.div`
    position: relative;
    display: inline-block;
    max-width: 100%;
    vertical-align: top;
`;

const Ghost = styled.div`
    visibility: hidden;
    pointer-events: none;
    user-select: none;
`;

const Layer = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 100%;
    overflow: visible;
`;

/** Reserves space for the full final frame; animated layer overlays without layout shift. */
export const AnimationSlot = ({ ghost, children }) => (
    <Root>
        <Ghost aria-hidden="true">{ghost}</Ghost>
        <Layer>{children}</Layer>
    </Root>
);

export default AnimationSlot;

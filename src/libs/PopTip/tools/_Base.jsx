import useVars from "./useVars";
import { FloatingUi } from "../../FloatingUi";
import styled from "styled-components";

const TriggerWrap = styled.span`
    all: unset;
    display: inline-flex;
`;

export const Base = ({ children, ...p }) => {
    const { floatingUiProps, openPopTip, closePopTip, onMouseEnter, onMouseLeave } = useVars(p);

    const handleEnter = onMouseEnter ?? openPopTip;
    const handleLeave = onMouseLeave ?? closePopTip;

    /* Return */
    return (
        <FloatingUi {...floatingUiProps} disableMultipleBlock>
            <TriggerWrap onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                {children}
            </TriggerWrap>
        </FloatingUi>
    );
};

import Styled from "./_styled";

export const Wrapper = ({ children, placement, index }) => {
    return (
        <Styled.container $placement={placement} $index={index}>
            {children}
        </Styled.container>
    );
};

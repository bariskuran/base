import { S } from "./_styled.js";

export const ScaleWrapper = ({ size, isMatch, children }) => (
    <S.ScaleDiv $size={size} $isMatch={isMatch}>
        {children}
    </S.ScaleDiv>
);

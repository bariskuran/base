import { S } from "./_styled.js";

export const ScaleWrapper = ({ size, isMatch, fullWidth, children }) => (
    <S.ScaleDiv $size={size} $isMatch={isMatch} $fullWidth={fullWidth}>
        {children}
    </S.ScaleDiv>
);

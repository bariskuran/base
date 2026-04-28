import { S } from "./_styled.js";

export const ScaleWrapper = ({ size, isMatch, fullWidth, children, disabled }) => (
    <S.ScaleDiv $size={size} $isMatch={isMatch} $fullWidth={fullWidth} $disabled={disabled}>
        {children}
    </S.ScaleDiv>
);

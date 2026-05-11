import { S } from "./_styled.js";

export const ScaleWrapper = ({ size, isMatch, fullWidth, children, disabled, isActivated }) => (
    <S.ScaleDiv
        $size={size}
        $isMatch={isMatch}
        $fullWidth={fullWidth}
        $disabled={disabled}
        style={{ cursor: disabled || isActivated ? "default" : "pointer" }}
    >
        {children}
    </S.ScaleDiv>
);

import { S } from "./_styled.js";

export const ScaleWrapper = ({
    size,
    isMatch,
    fullWidth,
    children,
    disabled,
    isActivated,
    isHovered,
    useLiftHitSlop,
    font,
    scaleWrapperProps = {},
}) => (
    <S.ScaleDiv
        $size={size}
        $isMatch={isMatch}
        $fullWidth={fullWidth}
        $disabled={disabled}
        $isHovered={isHovered}
        $isActivated={isActivated}
        $useLiftHitSlop={useLiftHitSlop}
        $font={font}
        style={{ cursor: disabled || isActivated ? "default" : "pointer" }}
        {...scaleWrapperProps}
    >
        {children}
    </S.ScaleDiv>
);

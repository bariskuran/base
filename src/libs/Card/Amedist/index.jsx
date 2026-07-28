import { forwardRef } from "react";
import { Icon } from "../../Icon";
import { S } from "./_styled";

const Amedist = forwardRef(function Amedist(
    { texts, thumbNode, isHovered, isClickable, disabled, supTitleIcon, ...rest },
    ref,
) {
    return (
        <S.Wrapper ref={ref} {...rest} $isClickable={isClickable} $isHovered={isHovered}>
            <S.line />
            {thumbNode && <S.Thumb>{thumbNode}</S.Thumb>}
            <S.Body>
                {(texts.supTitle || supTitleIcon) && (
                    <S.SupTitle>
                        {supTitleIcon ? <Icon icon={supTitleIcon} width={14} flat /> : null}
                        {texts.supTitle}
                    </S.SupTitle>
                )}
                {texts.title && <S.Title>{texts.title}</S.Title>}
                {texts.subtitle && <S.Subtitle>{texts.subtitle}</S.Subtitle>}
                {texts.description && <S.Description>{texts.description}</S.Description>}
                {texts.ctaLabel && !disabled && (
                    <S.Footer data-slot="footer">
                        <S.Cta $isHovered={isHovered} aria-hidden="true">
                            <Icon icon="arrowRight" width={14} color="inherit" flat />
                        </S.Cta>
                    </S.Footer>
                )}
            </S.Body>
        </S.Wrapper>
    );
});

const V = {
    component: Amedist,
};
export default V;

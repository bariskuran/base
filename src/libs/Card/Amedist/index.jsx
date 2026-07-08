import { forwardRef } from "react";
import { Button } from "../../Button";
import { S } from "./_styled";

const Amedist = forwardRef(function Amedist(
    { texts, thumbNode, isHovered, isClickable, disabled, ...rest },
    ref,
) {
    return (
        <S.Wrapper ref={ref} {...rest} $isClickable={isClickable} $isHovered={isHovered}>
            <S.line />
            {thumbNode && <S.Thumb>{thumbNode}</S.Thumb>}
            <S.Body>
                {texts.title && <S.Title>{texts.title}</S.Title>}
                {texts.subtitle && <S.Subtitle>{texts.subtitle}</S.Subtitle>}
                {texts.description && <S.Description>{texts.description}</S.Description>}
                {texts.ctaLabel && !disabled && (
                    <S.Footer data-slot="footer">
                        <Button.plain
                            tabIndex={-1}
                            hoverManually={isHovered}
                            icon={{ icon: "arrowRight" }}
                            //
                            bgColor="primary"
                            color="background"
                            hoverBgColor="primarys.shade20"
                        />
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

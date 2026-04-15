import S from "./_styled";
import useVars from "./useVars";
import { Button } from "../../Button";
import { colorAlpha } from "../../colorAlpha";
import { getText } from "../../getText";
import { copyToClipboard } from "../../copyToClipboard";
import { useExportedData } from "../../useExportedData";

export const Base = (props) => {
    const { children, content, contentArray, ...p } = props;
    const { isHover: isManuallyHover, exportData } = useExportedData();
    const vars = useVars({ children, content, contentArray, ...p });

    if (vars.hasNoContent) return null;

    const commonProps = {
        as: vars.as,
        $maxWidth: vars.maxWidth,
        $width: vars.width,
        $size: vars.size,
        $weight: vars.weight,
        $color: vars.color,
        $highlight: vars.highlight,
        $clamp: vars.clamp,
        $align: vars.align,
        $selfAlign: vars.selfAlign,
        $wrap: vars.wrap,
        $whiteSpace: vars.whiteSpace,
        $letterSpacing: vars.letterSpacing,
        $lineHeight: vars.lineHeight,
        $selectable: vars.selectable,
        $copyable: vars.copyable,
        $italic: vars.italic,
        $bold: vars.bold,
        $underline: vars.underline,
        $strikethrough: vars.strikethrough,
        $uppercase: vars.uppercase,
        $lowercase: vars.lowercase,
        $capitalize: vars.capitalize,
        $disabled: vars.disabled,
    };

    const B = (
        <Button.plain
            exportData={exportData}
            onClick={() => {
                copyToClipboard(content || children, { addToNotifier: true });
            }}
            outlined
            bgColor={colorAlpha(vars.color, 0.3)}
            hoverBgColor={colorAlpha(vars.color, 0)}
            popTip={getText("copyContent")}
            icon={{
                icon: "copy",
                width: 14,
                onActiveIcon: "check",
                onHoverColor: vars.color,
                onActiveColor: "primary",
            }}
        />
    );

    return (
        <>
            <S.wrapper $overlayCopy={vars.shouldUseOverlayCopy}>
                {vars.shouldUseInnerHtml ? (
                    <S.containerArea>
                        <S.container
                            {...commonProps}
                            ref={vars.ref}
                            $ellipsis={vars.ellipsis}
                            $overflow={vars.overflow}
                            $isManuallyHover={isManuallyHover}
                            dangerouslySetInnerHTML={{ __html: vars.truncatedHtml }}
                        />
                    </S.containerArea>
                ) : (
                    <S.containerArea>
                        <S.container
                            {...commonProps}
                            ref={vars.ref}
                            $ellipsis={vars.ellipsis}
                            $overflow={vars.overflow}
                            $isManuallyHover={isManuallyHover}
                        >
                            {vars.shouldRenderChildren ? vars.finalVisibleContent : null}
                            {vars.canUseInlineCopy && <S.inlineCopy>{B}</S.inlineCopy>}
                        </S.container>
                    </S.containerArea>
                )}

                {vars.shouldUseOverlayCopy && <S.overlayCopy>{B}</S.overlayCopy>}
            </S.wrapper>

            <S.measureSource
                {...commonProps}
                ref={vars.sourceRef}
                aria-hidden="true"
                $ellipsis={false}
                $overflow="visible"
                $hasOverlayCopy={vars.shouldUseOverlayCopy}
            >
                {vars.finalVisibleContent}
            </S.measureSource>
        </>
    );
};

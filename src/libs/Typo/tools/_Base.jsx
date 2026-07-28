import S from "./_styled";
import useVars from "./useVars";
import { Button } from "../../Button";
import { colorAlpha } from "../../colorAlpha";
import { getText } from "../../getText";
import { copyToClipboard } from "../../copyToClipboard";
import { useExportedData } from "helpers/useExportedData";
import NestedBaseUi, { NESTED_UI_TYPO_PHRASING_HOST } from "helpers/NestedBaseUi";
import { isTypoPhrasingOnlyHostTag } from "./isTypoPhrasingOnlyHostTag";

export const Base = (props) => {
    const { children, content, contentGroup, ...p } = props;
    const { isHover: isManuallyHover, exportData } = useExportedData();
    const vars = useVars({ children, content, contentGroup, ...p });

    if (contentGroup?.length) {
        return contentGroup.map((item, index) => (
            <Base key={index} {...p} content={item} contentGroup={undefined} />
        ));
    }

    if (vars.hasNoContent) return null;

    const commonProps = {
        as: vars.as,
        $maxWidth: vars.maxWidth,
        $disableMaxWidthLock: vars.disableMaxWidthLock,
        $width: vars.width,
        $size: vars.size || vars.fontSize,
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
        $unselectable: vars.unselectable,
        $italic: vars.italic,
        $bold: vars.bold,
        $underline: vars.underline,
        $strikethrough: vars.strikethrough,
        $uppercase: vars.uppercase,
        $lowercase: vars.lowercase,
        $capitalize: vars.capitalize,
        $disabled: vars.disabled,
        $margin: vars.margin,
        $padding: vars.padding,
        $enableQuoteMarks: vars.enableQuoteMarks,
        $fitContent: vars.fitContent,
        $balance: vars.balance,
        $inlineCopy: vars.canUseInlineCopy,
        $overlayCopyLayout: vars.shouldUseOverlayCopy,
        $stackedOverlayCopy: vars.shouldUseStackedOverlayCopy,
        $font: vars.font,
        style: {
            ...(vars.style || {}),
            ...(vars.fontStyle || {}),
        },
    };

    const CopyButton = (
        <Button.plain
            exportData={exportData}
            onClick={() => {
                copyToClipboard(vars.finalVisibleContent ?? content ?? children, {
                    addToNotifier: true,
                });
            }}
            outlined
            bgColor={colorAlpha(vars.color, 0.3)}
            hoverBgColor={colorAlpha(vars.color, 0)}
            activeBgColor="transparent"
            popTip={getText("copyContent")}
            icon={{
                icon: "copy",
                width: 14,
                activeIcon: "check",
                hoverColor: vars.color,
                activeColor: "primary",
            }}
        />
    );

    const visibleContent = vars.shouldRenderChildren ? vars.finalVisibleContent : null;

    const contentNode = vars.canUseInlineCopy ? (
        <>
            <S.inlineContent>{visibleContent}</S.inlineContent>
            <S.inlineCopy>{CopyButton}</S.inlineCopy>
        </>
    ) : (
        visibleContent
    );

    // Always key Fragment / multi-child rich JSX via NestedBaseUi (not only p/h/span).
    // Typo.quote uses as="blockquote", which is outside phrasing-only hosts — without this,
    // content like <>text <i>…</i> text</> warns about missing keys.
    const isPhrasingHost = isTypoPhrasingOnlyHostTag(vars.as);
    const innerMarked =
        !vars.shouldUseInnerHtml ? (
            <NestedBaseUi
                value={isPhrasingHost ? { [NESTED_UI_TYPO_PHRASING_HOST]: true } : undefined}
                content={contentNode}
            />
        ) : (
            contentNode
        );

    const Main = vars.shouldUseInnerHtml ? (
        <S.container
            {...commonProps}
            ref={vars.ref}
            $ellipsis={vars.ellipsis}
            $overflow={vars.overflow}
            $isManuallyHover={isManuallyHover}
            dangerouslySetInnerHTML={{ __html: vars.truncatedHtml }}
        />
    ) : (
        <S.container
            {...commonProps}
            ref={vars.ref}
            $ellipsis={vars.ellipsis}
            $overflow={vars.overflow}
            $isManuallyHover={isManuallyHover}
        >
            {innerMarked}
        </S.container>
    );

    if (!vars.copy) return Main;

    return (
        <S.wrapper
            $overlayCopy={vars.shouldUseOverlayCopy}
            $stackedOverlayCopy={vars.shouldUseStackedOverlayCopy}
            $as={vars.as}
            $maxWidth={vars.maxWidth}
            $width={vars.width}
            $fitContent={vars.fitContent}
            $disableMaxWidthLock={vars.disableMaxWidthLock}
        >
            {Main}
            {vars.shouldUseOverlayCopy && (
                <S.overlayCopy $stackedOverlayCopy={vars.shouldUseStackedOverlayCopy}>
                    {CopyButton}
                </S.overlayCopy>
            )}
        </S.wrapper>
    );
};

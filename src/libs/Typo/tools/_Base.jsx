// Base.jsx

import S from "./_styled";
import useVars from "./useVars";
import { Button } from "../../Button";
import { colorAlpha } from "../../colorAlpha";
import { getText } from "../../getText";
import { copyToClipboard } from "../../copyToClipboard";
import { useExportedData } from "../../useExportedData";
import NestedBaseUi, { NESTED_UI_TYPO_PHRASING_HOST } from "../../NestedBaseUi";
import { isTypoPhrasingOnlyHostTag } from "./isTypoPhrasingOnlyHostTag";

export const Base = (props) => {
    const { children, content, contentArray, ...p } = props;
    const { isHover: isManuallyHover, exportData } = useExportedData();
    const vars = useVars({ children, content, contentArray, ...p });

    if (contentArray?.length) {
        return (
            <>
                {contentArray.map((item, index) => (
                    <Base key={index} {...p} content={item} contentArray={undefined} />
                ))}
            </>
        );
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

    const innerFlow = vars.canUseInlineCopy ? (
        <>
            <S.inlineContent>
                {vars.shouldRenderChildren ? vars.finalVisibleContent : null}
            </S.inlineContent>
            <S.inlineCopy>{CopyButton}</S.inlineCopy>
        </>
    ) : (
        <>{vars.shouldRenderChildren ? vars.finalVisibleContent : null}</>
    );

    const innerMarked =
        isTypoPhrasingOnlyHostTag(vars.as) && !vars.shouldUseInnerHtml ? (
            <NestedBaseUi value={{ [NESTED_UI_TYPO_PHRASING_HOST]: true }}>
                {innerFlow}
            </NestedBaseUi>
        ) : (
            innerFlow
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
            $as={vars.as}
            $maxWidth={vars.maxWidth}
            $width={vars.width}
            $fitContent={vars.fitContent}
            $disableMaxWidthLock={vars.disableMaxWidthLock}
        >
            {Main}
            {vars.shouldUseOverlayCopy && <S.overlayCopy>{CopyButton}</S.overlayCopy>}
        </S.wrapper>
    );
};

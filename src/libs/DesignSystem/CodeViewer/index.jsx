import { useMemo } from "react";
import { Button } from "../../Button";
import { copyToClipboard } from "../../copyToClipboard";
import S from "./_styled";
import { dedent, formatJsxPropsForViewer, renderHighlightedCode } from "./tools/codeFormatters.jsx";

const CodeViewer = ({
    code,
    children,
    as = "pre",
    tabSize = 4,
    padding = 12,
    radius = 12,
    bg,
    color,
    maxHeight,
    wrap = false,
    formatJsxProps = true,
    ...props
}) => {
    const rawContent = code ?? children ?? "";

    const normalizedContent = useMemo(() => {
        const base = dedent(rawContent);
        return formatJsxProps ? formatJsxPropsForViewer(base) : base;
    }, [rawContent, formatJsxProps]);

    const renderedContent = useMemo(
        () => renderHighlightedCode(normalizedContent, S.tagStart),
        [normalizedContent],
    );

    return (
        <S.container
            as={as}
            $tabSize={tabSize}
            $padding={padding}
            $radius={radius}
            $bg={bg}
            $color={color}
            $maxHeight={maxHeight}
            $wrap={wrap}
            {...props}
        >
            <code>{renderedContent}</code>

            <S.buttonArea>
                <Button
                    onClick={() => {
                        copyToClipboard(normalizedContent, { addToNotifier: true });
                    }}
                    bgColor="greys.shade15"
                    icon={{
                        icon: "copy",
                        width: 16,
                        color: "greys.shade30",
                        hoverColor: "greys.shade60",
                        activeIcon: "check",
                    }}
                    popTip="Copy to clipboard"
                />
            </S.buttonArea>
        </S.container>
    );
};

export default CodeViewer;
